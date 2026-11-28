import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { Response } from 'supertest';
import type { Express } from 'express';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/platform/database/prisma';
import { PrismaEmployeeRepository } from '../../src/modules/employees/infrastructure/persistence/repository/employee.repository';
import {
  Employee,
  NewEmployeeProps,
} from '../../src/modules/employees/domain/entities/employee.entity';
import { DuplicateDocumentError } from '../../src/modules/employees/domain/errors/employee.error';
import type { AuditEntry } from '../../src/shared/audit/audit-entry';
import {
  borrarUsuarios,
  crearUsuarioConRol,
  loginToken,
} from '../helpers/auth';

type Rol = 'HR_ADMIN' | 'HR_ANALYST' | 'MANAGER';
const ROLES: Rol[] = ['HR_ADMIN', 'HR_ANALYST', 'MANAGER'];
const email = (rol: Rol) =>
  `e2e-employees-write-${rol.toLowerCase()}@test.local`;

/**
 * Marca de las filas de este archivo: el apellido paterno. Se borran al
 * empezar y al terminar, anulados incluidos, para que employees.e2e encuentre
 * la tabla sin colaboradores ajenos a su fixture.
 */
const MARCA = 'E2E-ESCRITURA';
const UBIGEO = { id: '150101' };
// DNIs 610000xx: no chocan con el fixture de lectura (70000001…, 40506070) ni contienen "4050".
let secuencia = 0;
const nuevoDni = () => String(61000000 + ++secuencia);
const nuevoCodigo = () => `E2E-W-${String(secuencia).padStart(3, '0')}`;
const nuevoCorreo = () => `ana.${secuencia}@e2e-escritura.test`;

const cuerpo = (cambios: Record<string, unknown> = {}) => ({
  documentType: 'DNI',
  documentNumber: nuevoDni(),
  firstNames: 'ANA LUCIA',
  lastNameFather: MARCA,
  lastNameMother: 'TORRES',
  hireDate: '2026-08-17',
  corporateEmail: nuevoCorreo(),
  ...cambios,
});

interface Ficha {
  id: string;
  updatedAt: string;
  [campo: string]: unknown;
}

describe('US-020b: alta, edición y anulación de la ficha del empleado', () => {
  let app: Express;
  const userIds = {} as Record<Rol, string>;
  const tokens = {} as Record<Rol, string>;

  const auth = (rol: Rol) => ({ Authorization: `Bearer ${tokens[rol]}` });
  const alta = (body: object, rol: Rol = 'HR_ADMIN') =>
    request(app).post('/api/employees').set(auth(rol)).send(body);
  const editar = (id: string, body: object, rol: Rol = 'HR_ADMIN') =>
    request(app).patch(`/api/employees/${id}`).set(auth(rol)).send(body);
  const anular = (id: string, rol: Rol = 'HR_ADMIN') =>
    request(app).delete(`/api/employees/${id}`).set(auth(rol));
  const leer = (id: string, rol: Rol = 'HR_ADMIN') =>
    request(app).get(`/api/employees/${id}`).set(auth(rol));

  const crear = async (
    cambios: Record<string, unknown> = {},
  ): Promise<Ficha> => {
    const res = await alta(cuerpo(cambios)).expect(201);
    return res.body.data as Ficha;
  };

  /** Cada respuesta trae X-Request-Id: es el correlationId de su auditoría. */
  const auditoriaDe = (res: Response) =>
    prisma.auditLog.findMany({
      where: { correlationId: res.headers['x-request-id'] as string },
    });

  const fila = (id: string) =>
    prisma.employee.findUniqueOrThrow({ where: { id } });

  const borrarFilasDeEsteArchivo = async () => {
    const where = { employee: { lastNameFather: MARCA } };
    await prisma.contract.deleteMany({ where });
    await prisma.employee.deleteMany({ where: { lastNameFather: MARCA } });
  };
  beforeAll(async () => {
    app = buildApp();
    await borrarFilasDeEsteArchivo();
    for (const rol of ROLES) {
      userIds[rol] = await crearUsuarioConRol(email(rol), rol);
      tokens[rol] = await loginToken(app, email(rol));
    }
  });

  afterAll(async () => {
    await borrarFilasDeEsteArchivo();
    const ids = Object.values(userIds);
    await prisma.auditLog.deleteMany({ where: { actorUserId: { in: ids } } });
    await borrarUsuarios(ids);
    await prisma.$disconnect();
  });

  describe('Escenario 1: alta', () => {
    it('responde 201 con los valores por defecto y la fecha sin hora', async () => {
      const body = cuerpo();
      const res = await alta(body).expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        documentNumber: body.documentNumber,
        fullName: `ANA LUCIA ${MARCA} TORRES`,
        status: 'ACTIVO',
        nationality: 'PERUANA',
        hireDate: '2026-08-17',
        terminationDate: null,
        deletedAt: null,
        employeeCode: null,
        phone: null,
        hasChildrenUnder18: false,
        essaludLifeInsurance: false,
      });
    });

    it('normaliza el documento y el correo, y guarda los opcionales', async () => {
      const dni = nuevoDni();
      const data = await crear({
        documentNumber: ` ${dni.slice(0, 4)} ${dni.slice(4)} `,
        employeeCode: nuevoCodigo(),
        corporateEmail: 'Ana.Torres@Empresa.PE',
        birthDate: '1990-05-20',
        ubigeoId: UBIGEO.id,
      });

      expect(data).toMatchObject({
        documentNumber: dni,
        corporateEmail: 'ana.torres@empresa.pe',
        birthDate: '1990-05-20',
        ubigeoId: UBIGEO.id,
      });
    });

    it('el GET devuelve la misma ficha que respondió el POST', async () => {
      const creada = await crear();

      const res = await leer(creada.id).expect(200);

      expect(res.body.data).toEqual(creada);
    });
  });

  describe('Escenario 2: duplicados', () => {
    it('un documento de un colaborador vivo responde 409 y no crea nada', async () => {
      const dni = nuevoDni();
      await crear({ documentNumber: dni });

      const res = await alta(cuerpo({ documentNumber: dni })).expect(409);

      expect(res.body.message).toBe(`Ya existe un colaborador con DNI ${dni}`);
      expect(
        await prisma.employee.count({ where: { documentNumber: dni } }),
      ).toBe(1);
    });

    it('un código de empleado repetido responde 409', async () => {
      const codigo = nuevoCodigo();
      await crear({ employeeCode: codigo });

      const res = await alta(cuerpo({ employeeCode: codigo })).expect(409);

      expect(res.body.message).toBe(
        `Ya existe un colaborador con el código ${codigo}`,
      );
    });

    it('con altas simultáneas del mismo documento, una crea y las demás reciben 409, nunca 500', async () => {
      const body = cuerpo();

      const respuestas = await Promise.all([1, 2, 3, 4].map(() => alta(body)));

      expect(respuestas.map((r) => r.status).sort()).toEqual([
        201, 409, 409, 409,
      ]);
      const creadas = await prisma.employee.findMany({
        where: { documentNumber: body.documentNumber },
      });
      expect(creadas).toHaveLength(1);
      const auditadas = await prisma.auditLog.count({
        where: { entityId: creadas[0]?.id, action: 'CREATE' },
      });
      expect(auditadas).toBe(1);
    });

    it('la violación de ux_employees_doc (P2002) se traduce a 409 y no deja auditoría', async () => {
      const dni = nuevoDni();
      await crear({ documentNumber: dni });
      const repo = new PrismaEmployeeRepository(prisma);
      const props: NewEmployeeProps = {
        employeeCode: null,
        documentType: 'DNI',
        documentNumber: dni,
        firstNames: 'REPETIDO',
        lastNameFather: MARCA,
        lastNameMother: 'P2002',
        sex: null,
        birthDate: null,
        maritalStatus: null,
        nationality: 'PERUANA',
        corporateEmail: 'repetido.p2002@e2e-escritura.test',
        personalEmail: null,
        phone: null,
        address: null,
        ubigeoId: null,
        hireDate: new Date('2026-08-17T00:00:00.000Z'),
        hasChildrenUnder18: false,
        essaludLifeInsurance: false,
        photoUrl: null,
      };
      const employee = Employee.create(props, randomUUID(), new Date());
      const correlationId = randomUUID();
      const audit: AuditEntry = {
        actorUserId: userIds.HR_ADMIN,
        ipAddress: null,
        correlationId,
        action: 'CREATE',
        entityType: 'employees',
        entityId: employee.id,
        oldValues: null,
        newValues: {},
      };

      const error = await repo.create(employee, audit).catch((e) => e);

      expect(error).toBeInstanceOf(DuplicateDocumentError);
      expect(error.statusCode).toBe(409);
      expect(await prisma.auditLog.count({ where: { correlationId } })).toBe(0);
    });

    it('el documento de un colaborador anulado se puede volver a registrar', async () => {
      const dni = nuevoDni();
      const anulada = await crear({ documentNumber: dni });
      await anular(anulada.id).expect(200);

      const res = await alta(cuerpo({ documentNumber: dni })).expect(201);

      expect(res.body.data.id).not.toBe(anulada.id);
    });
  });

  describe('Escenario 3: formato del documento y de los datos', () => {
    it('un DNI de 7 dígitos responde 422 con el campo y el mensaje', async () => {
      const res = await alta(cuerpo({ documentNumber: '1234567' })).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'documentNumber',
        message: 'El DNI debe tener exactamente 8 dígitos',
      });
    });

    it('un CE de 8 caracteres responde 422 y uno de 9 se acepta', async () => {
      await alta(
        cuerpo({ documentType: 'CE', documentNumber: '12345678' }),
      ).expect(422);

      const res = await alta(
        cuerpo({ documentType: 'CE', documentNumber: `0${nuevoDni()}` }),
      ).expect(201);
      expect(res.body.data.documentType).toBe('CE');
    });

    it('una fecha que no existe responde 422', async () => {
      const res = await alta(cuerpo({ hireDate: '2026-02-31' })).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'hireDate',
        message: 'La fecha no existe en el calendario',
      });
    });

    it('un ubigeo que no existe en el catálogo responde 422 sin llegar a la FK', async () => {
      const res = await alta(cuerpo({ ubigeoId: '999999' })).expect(422);

      expect(res.body.message).toBe('El ubigeo 999999 no existe');
    });
  });

  describe('Escenario 4: edición parcial', () => {
    it('cambia solo los campos enviados y updatedAt avanza', async () => {
      const antes = await crear({
        phone: '900000001',
        address: 'JR. CUSCO 100',
      });

      const res = await editar(antes.id, {
        phone: '987654321',
        address: 'AV. AREQUIPA 123',
      }).expect(200);

      const despues = res.body.data as Ficha;
      expect(despues).toMatchObject({
        phone: '987654321',
        address: 'AV. AREQUIPA 123',
      });
      const { phone: _p1, address: _a1, updatedAt: _u1, ...restoAntes } = antes;
      const {
        phone: _p2,
        address: _a2,
        updatedAt: _u2,
        ...restoDespues
      } = despues;
      expect(restoDespues).toEqual(restoAntes);
      expect(new Date(despues.updatedAt).getTime()).toBeGreaterThan(
        new Date(antes.updatedAt).getTime(),
      );
    });

    it('null borra un campo opcional', async () => {
      const antes = await crear({ phone: '900000001' });

      const res = await editar(antes.id, { phone: null }).expect(200);

      expect(res.body.data.phone).toBeNull();
    });

    it('un cuerpo vacío responde 422', async () => {
      const antes = await crear();

      const res = await editar(antes.id, {}).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'body',
        message: 'Debe enviar al menos un campo',
      });
    });

    it('cambiar el documento al de otro colaborador responde 409', async () => {
      const dniAjeno = nuevoDni();
      await crear({ documentNumber: dniAjeno });
      const propia = await crear();

      await editar(propia.id, { documentNumber: dniAjeno }).expect(409);
    });

    it('un colaborador inexistente responde 404', async () => {
      await editar(randomUUID(), { phone: '987654321' }).expect(404);
    });
  });

  describe('Escenario 5: campos que el PATCH no puede tocar', () => {
    it('fullName, deletedAt e id responden 422 indicando el campo', async () => {
      const antes = await crear();

      const res = await editar(antes.id, {
        fullName: 'OTRO',
        deletedAt: null,
        id: randomUUID(),
      }).expect(422);

      const mensajes = (res.body.errors as { message: string }[])
        .map((e) => e.message)
        .join(' ');
      for (const campo of ['fullName', 'deletedAt', 'id']) {
        expect(mensajes).toContain(`"${campo}"`);
      }
    });

    it.each([
      ['status', { status: 'CESADO' }],
      ['terminationDate', { terminationDate: '2026-09-01' }],
    ])(
      'intentar el cese con %s responde 403 y no cambia nada',
      async (_campo, body) => {
        const antes = await crear();

        const res = await editar(antes.id, body).expect(403);

        expect(res.body.code).toBe('FORBIDDEN');
        expect(await fila(antes.id)).toMatchObject({
          status: 'ACTIVO',
          terminationDate: null,
        });
      },
    );

    it('mover hireDate después del cese responde 422 por invariante, sin llegar al CHECK', async () => {
      const id = randomUUID();
      await prisma.employee.create({
        data: {
          id,
          documentType: 'DNI',
          documentNumber: nuevoDni(),
          firstNames: 'CESADA',
          lastNameFather: MARCA,
          lastNameMother: 'FECHAS',
          corporateEmail: 'cesada.fechas@e2e-escritura.test',
          hireDate: new Date('2025-01-15'),
          status: 'CESADO',
          terminationDate: new Date('2026-06-30'),
        },
      });

      const res = await editar(id, { hireDate: '2026-07-01' }).expect(422);

      expect(res.body.message).toBe(
        'La fecha de cese no puede ser anterior a la fecha de ingreso',
      );
      expect((await fila(id)).hireDate.toISOString().slice(0, 10)).toBe(
        '2025-01-15',
      );
    });
  });

  describe('Permisos de escritura', () => {
    it.each<Rol>(['HR_ANALYST', 'MANAGER'])(
      '%s no puede dar de alta (403)',
      async (rol) => {
        const res = await alta(cuerpo(), rol).expect(403);

        expect(res.body.code).toBe('FORBIDDEN');
      },
    );

    it('HR_ANALYST puede editar, y la respuesta no trae los campos sensibles', async () => {
      const antes = await crear();

      const res = await editar(
        antes.id,
        { phone: '912345678' },
        'HR_ANALYST',
      ).expect(200);

      expect(res.body.data.phone).toBe('912345678');
      expect(res.body.data).not.toHaveProperty('hasChildrenUnder18');
      expect(res.body.data).not.toHaveProperty('essaludLifeInsurance');
    });

    it('HR_ANALYST no puede editar un campo sensible (D6) y el valor no cambia', async () => {
      const antes = await crear();

      const res = await editar(
        antes.id,
        { hasChildrenUnder18: true },
        'HR_ANALYST',
      ).expect(403);

      expect(res.body.message).toBe(
        'No tiene permiso para registrar hasChildrenUnder18',
      );
      expect((await fila(antes.id)).hasChildrenUnder18).toBe(false);
    });

    it('MANAGER no puede editar (403)', async () => {
      const antes = await crear();

      await editar(antes.id, { phone: '912345678' }, 'MANAGER').expect(403);
    });

    it('sin token, alta, edición y anulación responden 401', async () => {
      const id = randomUUID();

      await request(app).post('/api/employees').send(cuerpo()).expect(401);
      await request(app)
        .patch(`/api/employees/${id}`)
        .send({ phone: '9' })
        .expect(401);
      await request(app).delete(`/api/employees/${id}`).expect(401);
    });
  });

  describe('Escenario 9: auditoría atómica', () => {
    it('el alta deja una fila CREATE con el contexto de la petición', async () => {
      const body = cuerpo();
      const res = await alta(body).expect(201);

      const filas = await auditoriaDe(res);

      expect(filas).toHaveLength(1);
      expect(filas[0]).toMatchObject({
        action: 'CREATE',
        entityType: 'employees',
        entityId: res.body.data.id,
        actorUserId: userIds.HR_ADMIN,
        oldValues: null,
      });
      expect(filas[0]?.ipAddress).toBeTruthy();
      expect(filas[0]?.newValues).toMatchObject({
        documentNumber: body.documentNumber,
        status: 'ACTIVO',
        hireDate: '2026-08-17T00:00:00.000Z',
      });
    });

    it('la edición registra un UPDATE solo con los campos que cambiaron', async () => {
      const antes = await crear({
        phone: '999111222',
        address: 'JR. CUSCO 100',
      });

      const res = await editar(antes.id, {
        phone: '987654321',
        address: 'JR. CUSCO 100',
      }).expect(200);

      const filas = await auditoriaDe(res);
      expect(filas).toHaveLength(1);
      expect(filas[0]).toMatchObject({
        action: 'UPDATE',
        entityId: antes.id,
        oldValues: { phone: '999111222' },
        newValues: { phone: '987654321' },
      });
    });

    it('una edición sin cambios no escribe ni audita', async () => {
      const antes = await crear({ phone: '999111222' });

      const res = await editar(antes.id, { phone: '999111222' }).expect(200);

      expect(res.body.data.updatedAt).toBe(antes.updatedAt);
      expect(await auditoriaDe(res)).toHaveLength(0);
    });

    it('si la auditoría falla, el alta se revierte', async () => {
      const repo = new PrismaEmployeeRepository(prisma);
      const dni = nuevoDni();
      const employee = Employee.create(
        {
          employeeCode: null,
          documentType: 'DNI',
          documentNumber: dni,
          firstNames: 'SIN',
          lastNameFather: MARCA,
          lastNameMother: 'AUDITORIA',
          sex: null,
          birthDate: null,
          maritalStatus: null,
          nationality: 'PERUANA',
          corporateEmail: 'sin.auditoria@e2e-escritura.test',
          personalEmail: null,
          phone: null,
          address: null,
          ubigeoId: null,
          hireDate: new Date('2026-08-17T00:00:00.000Z'),
          hasChildrenUnder18: false,
          essaludLifeInsurance: false,
          photoUrl: null,
        },
        randomUUID(),
        new Date(),
      );

      // Un actor que no existe viola la FK de audit_logs hacia users.
      await expect(
        repo.create(employee, {
          actorUserId: randomUUID(),
          ipAddress: null,
          correlationId: randomUUID(),
          action: 'CREATE',
          entityType: 'employees',
          entityId: employee.id,
          oldValues: null,
          newValues: {},
        }),
      ).rejects.toThrow();

      expect(
        await prisma.employee.count({ where: { documentNumber: dni } }),
      ).toBe(0);
    });

    it('las lecturas no generan auditoría', async () => {
      const creada = await crear();

      const res = await leer(creada.id).expect(200);

      expect(await auditoriaDe(res)).toHaveLength(0);
    });
  });

  describe('Escenario 10: anulación registral', () => {
    it('responde 200, marca deletedAt sin borrar la fila ni tocar el cese, y audita un DELETE', async () => {
      const creada = await crear();

      const res = await anular(creada.id).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/anulado/i);
      const anulada = await fila(creada.id);
      expect(anulada.deletedAt).not.toBeNull();
      expect(anulada).toMatchObject({
        status: 'ACTIVO',
        terminationDate: null,
      });
      const filas = await auditoriaDe(res);
      expect(filas).toHaveLength(1);
      expect(filas[0]).toMatchObject({
        action: 'DELETE',
        entityId: creada.id,
        oldValues: { deletedAt: null },
        newValues: { deletedAt: anulada.deletedAt?.toISOString() },
      });
    });

    it('después de anular no aparece en el detalle, el listado ni la edición', async () => {
      const creada = await crear();
      await anular(creada.id).expect(200);

      await leer(creada.id).expect(404);
      const lista = await request(app)
        .get('/api/employees')
        .query({ search: creada.documentNumber as string })
        .set(auth('HR_ADMIN'))
        .expect(200);
      expect(lista.body.pagination.total).toBe(0);
      await editar(creada.id, { phone: '987654321' }).expect(404);
      await anular(creada.id).expect(404);
    });

    it('HR_ANALYST no puede anular (requiere colaborador:cesar)', async () => {
      const creada = await crear();

      await anular(creada.id, 'HR_ANALYST').expect(403);

      expect((await fila(creada.id)).deletedAt).toBeNull();
    });

    it('con al menos un contrato responde 409, remite al cese y no anula', async () => {
      const creada = await crear();
      const [tipo, puesto, sede, division] = await Promise.all([
        prisma.contractType.findFirstOrThrow(),
        prisma.position.findFirstOrThrow(),
        prisma.branch.findFirstOrThrow(),
        prisma.division.findFirstOrThrow(),
      ]);
      await prisma.contract.create({
        data: {
          employeeId: creada.id,
          contractTypeId: tipo.id,
          positionId: puesto.id,
          branchId: sede.id,
          divisionId: division.id,
          startDate: new Date('2026-08-17'),
          salary: 1500,
          weeklyHours: 48,
          workingCondition: 'Tiempo completo',
        },
      });

      const res = await anular(creada.id).expect(409);

      expect(res.body.message).toMatch(/cese/);
      expect((await fila(creada.id)).deletedAt).toBeNull();
      expect(await auditoriaDe(res)).toHaveLength(0);
    });

    it('un id que no es UUID responde 422', async () => {
      const res = await anular('no-es-un-uuid').expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'id',
        message: 'Invalid UUID',
      });
    });
  });
});
