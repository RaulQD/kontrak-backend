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
    email: nuevoCorreo(),
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
    return res.body.data as { id: string; email: string; updatedAt: string };
  };
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
      const { email: _sinCorreo, ...body } = cuerpo();

      const res = await alta(body).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'email',
        message: 'El correo corporativo es obligatorio',
      });
      expect(
        await prisma.employee.count({
          where: { documentNumber: body.documentNumber },
        }),
      ).toBe(0);
    });

    it.each(['', '   '])('un correo vacío (%j) responde 422', async (email) => {
      const res = await alta(cuerpo({ email })).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'email',
        message: 'El correo corporativo es obligatorio',
      });
    });

    it('un correo mal formado responde 422', async () => {
      const res = await alta(cuerpo({ email: 'ana@' })).expect(422);

      expect(res.body.errors).toContainEqual({
        field: 'email',
        message: 'El correo no es válido',
      });
    });

    it('se guarda y se devuelve sin espacios y en minúsculas', async () => {
      const n = randomUUID().slice(0, 8);

      const creada = await crear({ email: `  Ana.Perez.${n}@Empresa.PE ` });

      expect(creada.email).toBe(`ana.perez.${n}@empresa.pe`);
      expect(await correoGuardado(creada.id)).toBe(`ana.perez.${n}@empresa.pe`);
    });

    it.each([null, ''])(
      'un PATCH con email %j responde 422 y no lo borra',
      async (email) => {
        const creada = await crear();

        const res = await editar(creada.id, { email }).expect(422);

        expect(res.body.errors).toContainEqual({
          field: 'email',
          message: 'El correo corporativo es obligatorio',
        });
        expect(await correoGuardado(creada.id)).toBe(creada.email);
      },
    );

    it('un PATCH puede cambiarlo, y lo normaliza', async () => {
      const creada = await crear();

      const res = await editar(creada.id, {
        email: ' Nuevo.Correo@Empresa.PE',
      }).expect(200);

      expect(res.body.data.email).toBe('nuevo.correo@empresa.pe');
    });

    it('la base de datos no acepta un colaborador sin correo (NOT NULL)', async () => {
      const filas = await prisma.$queryRaw<{ is_nullable: string }[]>`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'employees' AND column_name = 'corporate_email'`;

      expect(filas[0]?.is_nullable).toBe('NO');
    });
  });
});
