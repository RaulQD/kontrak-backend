import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import type { Express } from 'express';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/platform/database/prisma';

const PASSWORD = 'Password123';
const PASSWORD_INCORRECTA = 'Incorrecta123!';
const EMAIL_ADMIN = 'e2e-revocation-admin@test.local';
const EMAIL_OBJETIVO = 'e2e-revocation-objetivo@test.local';
const EMAIL_SONDA = 'e2e-revocation-sonda@test.local';
const EMAIL_INEXISTENTE = 'e2e-revocation-no-existe@test.local';

// bcrypt con costo 12 tarda ~250 ms por login: los tests que encadenan varios
// logins necesitan más que los 5 s por defecto de Vitest.
const TIMEOUT_LENTO = 20_000;

const mediana = (valores: number[]): number => {
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
};

const esperar = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('TASK-08: revocación inmediata y login sin enumeración por tiempo', () => {
  let app: Express;
  let idAdmin: string;
  let idObjetivo: string;
  let idSonda: string;

  const crearUsuarioConRol = async (
    email: string,
    rol: string,
  ): Promise<string> => {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: rol } });
    const existente = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    const user =
      existente ??
      (await prisma.user.create({
        data: { email, passwordHash: await bcrypt.hash(PASSWORD, 12) },
      }));
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
    return user.id;
  };

  const login = (email: string, password = PASSWORD) =>
    request(app).post('/api/auth/login').send({ email, password });

  const loginToken = async (email: string): Promise<string> => {
    const res = await login(email).expect(200);
    return res.body.data.accessToken;
  };

  const cerrarSesiones = (userId: string, token: string) =>
    request(app)
      .delete(`/api/users/${userId}/sessions`)
      .set('Authorization', `Bearer ${token}`);

  // authenticate solo protege DELETE /api/users/:id/sessions. Se llama sobre un
  // usuario "sonda" para saber si un token sigue valiendo sin cerrar las
  // sesiones de nadie que participe en el test: 200 = aceptado, 401 = rechazado.
  const usarToken = (token: string) => cerrarSesiones(idSonda, token);

  beforeAll(async () => {
    app = buildApp();
    idAdmin = await crearUsuarioConRol(EMAIL_ADMIN, 'SUPER_ADMIN');
    // SUPER_ADMIN para que su token pueda llamar al único endpoint protegido.
    idObjetivo = await crearUsuarioConRol(EMAIL_OBJETIVO, 'SUPER_ADMIN');
    idSonda = await crearUsuarioConRol(EMAIL_SONDA, 'EMPLOYEE');
  });

  beforeEach(async () => {
    // Cada test parte de usuarios activos, sin revocaciones ni intentos fallidos.
    await prisma.user.updateMany({
      where: { id: { in: [idAdmin, idObjetivo] } },
      data: {
        isActive: true,
        deletedAt: null,
        tokensRevokedAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLoginAt: null,
      },
    });
  });

  afterAll(async () => {
    const ids = [idAdmin, idObjetivo, idSonda];
    await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });
    await prisma.userRole.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login con un email inexistente', () => {
    it('responde el mismo 401 que una contraseña incorrecta', async () => {
      const conPasswordMala = await login(
        EMAIL_OBJETIVO,
        PASSWORD_INCORRECTA,
      ).expect(401);
      const conEmailInexistente = await login(
        EMAIL_INEXISTENTE,
        PASSWORD_INCORRECTA,
      ).expect(401);

      expect(conEmailInexistente.body).toEqual(conPasswordMala.body);
    });

    it(
      'tarda lo mismo que una contraseña incorrecta: también ejecuta bcrypt',
      async () => {
        const medir = async (email: string): Promise<number> => {
          const inicio = performance.now();
          await login(email, PASSWORD_INCORRECTA).expect(401);
          return performance.now() - inicio;
        };
        // Calienta la conexión a la BD para que no cuente en las mediciones.
        await medir(EMAIL_INEXISTENTE);

        const conPasswordMala: number[] = [];
        const conEmailInexistente: number[] = [];
        // Intercaladas, para que un cambio de carga afecte a ambas por igual.
        // Son 3 intentos fallidos: el bloqueo se activa con 5.
        for (let i = 0; i < 3; i++) {
          conPasswordMala.push(await medir(EMAIL_OBJETIVO));
          conEmailInexistente.push(await medir(EMAIL_INEXISTENTE));
        }

        // Sin simulateVerify el email inexistente responde en una fracción
        // mínima del tiempo (no hay bcrypt); con él, ambos cuestan un bcrypt.
        expect(mediana(conEmailInexistente)).toBeGreaterThanOrEqual(
          0.5 * mediana(conPasswordMala),
        );
      },
      TIMEOUT_LENTO,
    );
  });

  describe('DELETE /api/users/:id/sessions', () => {
    it(
      'el access token emitido antes de la revocación responde 401 de inmediato',
      async () => {
        const tokenAdmin = await loginToken(EMAIL_ADMIN);
        const tokenObjetivo = await loginToken(EMAIL_OBJETIVO);
        await usarToken(tokenObjetivo).expect(200);

        await cerrarSesiones(idObjetivo, tokenAdmin).expect(200);

        const res = await usarToken(tokenObjetivo).expect(401);
        expect(res.body).toEqual({
          success: false,
          message: 'La sesión fue cerrada. Inicia sesión nuevamente',
          code: 'UNAUTHORIZED',
        });
        // Solo se invalidan los tokens del usuario indicado.
        await usarToken(tokenAdmin).expect(200);
      },
      TIMEOUT_LENTO,
    );

    it(
      'un login posterior a la revocación obtiene un token válido',
      async () => {
        const tokenAdmin = await loginToken(EMAIL_ADMIN);
        await cerrarSesiones(idObjetivo, tokenAdmin).expect(200);

        // iat se mide en segundos: un token emitido en el mismo segundo de la
        // revocación también se rechaza. Pasado ese segundo, el login vale.
        await esperar(1100);
        const tokenNuevo = await loginToken(EMAIL_OBJETIVO);

        await usarToken(tokenNuevo).expect(200);
      },
      TIMEOUT_LENTO,
    );
  });

  describe('Usuario desactivado o eliminado', () => {
    it('el token vigente de un usuario con isActive = false responde 401', async () => {
      const token = await loginToken(EMAIL_OBJETIVO);
      await usarToken(token).expect(200);

      await prisma.user.update({
        where: { id: idObjetivo },
        data: { isActive: false },
      });

      const res = await usarToken(token).expect(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('el token vigente de un usuario eliminado (deletedAt) responde 401', async () => {
      const token = await loginToken(EMAIL_OBJETIVO);
      await usarToken(token).expect(200);

      await prisma.user.update({
        where: { id: idObjetivo },
        data: { deletedAt: new Date() },
      });

      const res = await usarToken(token).expect(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });
  });
});
