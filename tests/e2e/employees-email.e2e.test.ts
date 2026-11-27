import type { Response } from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { Express } from 'express';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/platform/database/prisma';
import {
  borrarUsuarios,
  crearUsuarioConRol,
  loginToken,
} from '../helpers/auth';
import { PrismaEmployeeRepository } from '../../src/modules/employees/infrastructure/persistence/repository/employee.repository';
import { Employee } from '../../src/modules/employees/domain/entities/employee.entity';
import { DuplicateEmailError } from '../../src/modules/employees/domain/errors/employee.error';

const EMAIL_ADMIN = 'e2e-employees-email-hr_admin@test.local';

/** Marca de las filas de este archivo (apellido paterno): se borran al empezar y al terminar. */
const MARCA = 'E2E-CORREO';

// DNIs 620000xx: no chocan con los demás e2e ni contienen "4050".
let secuencia = 0;
const nuevoDni = () => String(62000000 + ++secuencia);
const nuevoCorreo = () => `colaborador.${secuencia}@e2e-correo.test`;

const cuerpo = (cambios: Record<string, unknown> = {}) => {
  const documentNumber = nuevoDni();
  return {
    documentType: 'DNI',
    documentNumber,
    firstNames: 'PRUEBA',
    lastNameFather: MARCA,
    lastNameMother: 'CORREO',
    hireDate: '2026-08-17',
    corporateEmail: nuevoCorreo(),
    ...cambios,
  };
};

describe('US-020c: correo corporativo obligatorio y único', () => {
  let app: Express;
  let adminId: string;
  let token: string;

  const auth = () => ({ Authorization: `Bearer ${token}` });
  const alta = (body: object) =>
    request(app).post('/api/employees').set(auth()).send(body);
  const editar = (id: string, body: object) =>
    request(app).patch(`/api/employees/${id}`).set(auth()).send(body);
  const crear = async (cambios: Record<string, unknown> = {}) => {
    const res = await alta(cuerpo(cambios)).expect(201);
    return res.body.data as {
      id: string;
      corporateEmail: string;
      updatedAt: string;
    };
  };
  const auditoriaDe = (res: Response) =>
    prisma.auditLog.findMany({
      where: { correlationId: res.headers['x-request-id'] as string },
    });
  const correoGuardado = async (id: string) =>
    (await prisma.employee.findUniqueOrThrow({ where: { id } })).corporateEmail;

  const borrarFilasDeEsteArchivo = () =>
    prisma.employee.deleteMany({ where: { lastNameFather: MARCA } });

  beforeAll(async () => {
    app = buildApp();
    await borrarFilasDeEsteArchivo();
    adminId = await crearUsuarioConRol(EMAIL_ADMIN, 'HR_ADMIN');
    token = await loginToken(app, EMAIL_ADMIN);
  });

  afterAll(async () => {
    await borrarFilasDeEsteArchivo();
    await prisma.auditLog.deleteMany({ where: { actorUserId: adminId } });
    await borrarUsuarios([adminId]);
    await prisma.$disconnect();
  });

  describe('obligatorio', () => {
    it('un alta sin correo responde 422 y no crea nada', async () => {
      const { corporateEmail: _sinCorreo, ...body } = cuerpo();

      const res = await alta(body).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'corporateEmail',
        message: 'El correo corporativo es obligatorio',
      });
      expect(
        await prisma.employee.count({
          where: { documentNumber: body.documentNumber },
        }),
      ).toBe(0);
    });

    it.each(['', '   '])(
      'un correo vacío (%j) responde 422',
      async (corporateEmail) => {
        const res = await alta(cuerpo({ corporateEmail })).expect(422);

        expect(res.body.errors).toContainEqual({
          field: 'corporateEmail',
          message: 'El correo corporativo es obligatorio',
        });
      },
    );

    it('un correo mal formado responde 422', async () => {
      const res = await alta(cuerpo({ corporateEmail: 'ana@' })).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'corporateEmail',
        message: 'El correo no es válido',
      });
    });

    it('se guarda y se devuelve sin espacios y en minúsculas', async () => {
      const n = randomUUID().slice(0, 8);

      const creada = await crear({
        corporateEmail: `  Ana.Perez.${n}@Empresa.PE `,
      });

      expect(creada.corporateEmail).toBe(`ana.perez.${n}@empresa.pe`);
      expect(await correoGuardado(creada.id)).toBe(`ana.perez.${n}@empresa.pe`);
    });

    it.each([null, ''])(
      'un PATCH con email %j responde 422 y no lo borra',
      async (corporateEmail) => {
        const creada = await crear();

        const res = await editar(creada.id, { corporateEmail }).expect(422);

        expect(res.body.errors).toContainEqual({
          field: 'corporateEmail',
          message: 'El correo corporativo es obligatorio',
        });
        expect(await correoGuardado(creada.id)).toBe(creada.corporateEmail);
      },
    );

    it('un PATCH puede cambiarlo, y lo normaliza', async () => {
      const creada = await crear();

      const res = await editar(creada.id, {
        corporateEmail: ' Nuevo.Correo@Empresa.PE',
      }).expect(200);

      expect(res.body.data.corporateEmail).toBe('nuevo.correo@empresa.pe');
    });

    it('la base de datos no acepta un colaborador sin correo (NOT NULL)', async () => {
      const filas = await prisma.$queryRaw<{ is_nullable: string }[]>`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'employees' AND column_name = 'corporate_email'`;

      expect(filas[0]?.is_nullable).toBe('NO');
    });
  });
  describe('único', () => {
    it('el correo de un vigente, aunque cambien las mayúsculas, responde 409 y no deja ni fila ni auditoría', async () => {
      const existente = await crear();
      const body = cuerpo({
        corporateEmail: existente.corporateEmail.toUpperCase(),
      });

      const res = await alta(body).expect(409);

      expect(res.body.message).toBe(
        `Ya existe un colaborador con el correo ${existente.corporateEmail}`,
      );
      expect(
        await prisma.employee.count({
          where: { documentNumber: body.documentNumber },
        }),
      ).toBe(0);
      expect(await auditoriaDe(res)).toHaveLength(0);
    });

    it('el correo de un cesado sigue reservado, en el alta y en la edición', async () => {
      const correoDelCesado = `cesado.${randomUUID()}@e2e-correo.test`;
      await prisma.employee.create({
        data: {
          documentType: 'DNI',
          documentNumber: nuevoDni(),
          firstNames: 'CESADO',
          lastNameFather: MARCA,
          lastNameMother: 'CORREO',
          hireDate: new Date('2025-01-15'),
          status: 'CESADO',
          terminationDate: new Date('2026-06-30'),
          corporateEmail: correoDelCesado,
        },
      });
      const otro = await crear();

      await alta(cuerpo({ corporateEmail: correoDelCesado })).expect(409);
      await editar(otro.id, { corporateEmail: correoDelCesado }).expect(409);
    });

    it('el correo de un anulado queda libre', async () => {
      const anulada = await crear();
      await request(app)
        .delete(`/api/employees/${anulada.id}`)
        .set(auth())
        .expect(200);

      const res = await alta(
        cuerpo({ corporateEmail: anulada.corporateEmail }),
      ).expect(201);

      expect(res.body.data.corporateEmail).toBe(anulada.corporateEmail);
    });

    it('un PATCH con su propio correo en otras mayúsculas no es un conflicto ni escribe', async () => {
      const creada = await crear();

      const res = await editar(creada.id, {
        corporateEmail: creada.corporateEmail.toUpperCase(),
      }).expect(200);

      expect(res.body.data.updatedAt).toBe(creada.updatedAt);
      expect(await auditoriaDe(res)).toHaveLength(0);
    });

    it('un PATCH con el correo de otro colaborador responde 409 y no lo cambia', async () => {
      const ajena = await crear();
      const propia = await crear();

      const res = await editar(propia.id, {
        corporateEmail: ajena.corporateEmail,
      }).expect(409);

      expect(res.body.message).toBe(
        `Ya existe un colaborador con el correo ${ajena.corporateEmail}`,
      );
      expect(await correoGuardado(propia.id)).toBe(propia.corporateEmail);
    });

    it('con altas simultáneas del mismo correo, una crea y las demás reciben 409, nunca 500', async () => {
      const corporateEmail = `carrera.${randomUUID()}@e2e-correo.test`;

      const respuestas = await Promise.all(
        [1, 2, 3, 4].map(() => alta(cuerpo({ corporateEmail }))),
      );

      expect(respuestas.map((r) => r.status).sort()).toEqual([
        201, 409, 409, 409,
      ]);
      expect(await prisma.employee.count({ where: { corporateEmail } })).toBe(
        1,
      );
    });

    it('juan_perez y juanxperez son correos distintos: "_" no es un comodín', async () => {
      // Primero el que no tiene "_": buscar "juan_perez" con ILIKE lo encontraría.
      await crear({ corporateEmail: 'juanxperez@e2e-correo.test' });

      await crear({ corporateEmail: 'juan_perez@e2e-correo.test' });
    });

    it('la violación de ux_employees_email (P2002) se traduce a 409 con el mensaje del correo', async () => {
      const existente = await crear();
      const repo = new PrismaEmployeeRepository(prisma);
      const employee = Employee.create(
        {
          employeeCode: null,
          documentType: 'DNI',
          documentNumber: nuevoDni(),
          firstNames: 'REPETIDO',
          lastNameFather: MARCA,
          lastNameMother: 'P2002',
          sex: null,
          birthDate: null,
          maritalStatus: null,
          nationality: 'PERUANA',
          corporateEmail: existente.corporateEmail,
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
      const correlationId = randomUUID();

      const error = await repo
        .create(employee, {
          actorUserId: adminId,
          ipAddress: null,
          correlationId,
          action: 'CREATE',
          entityType: 'employees',
          entityId: employee.id,
          oldValues: null,
          newValues: {},
        })
        .catch((e) => e);

      expect(error).toBeInstanceOf(DuplicateEmailError);
      expect(error.statusCode).toBe(409);
      expect(await prisma.auditLog.count({ where: { correlationId } })).toBe(0);
    });
  });
});
