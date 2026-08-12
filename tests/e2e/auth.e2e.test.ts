import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import type { Express } from 'express';
import { createApp } from '../../src/services/app';
import { prisma } from '../../src/platform/database/prisma';

const EMAIL = 'e2e-auth@test.local';
const PASSWORD = 'Password123';

const decodePayload = (jwt: string) =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());

describe('US-007: autenticación JWT + refresh token', () => {
  let app: Express;
  let userId: string;

  beforeAll(async () => {
    app = await createApp();
    // email no es @unique en Prisma (índice parcial en SQL), upsert no aplica
    const user =
      (await prisma.user.findFirst({
        where: { email: EMAIL, deletedAt: null },
      })) ??
      (await prisma.user.create({
        data: { email: EMAIL, passwordHash: await bcrypt.hash(PASSWORD, 12) },
      }));
    userId = user.id;
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLoginAt: null,
      },
    });
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  const login = () =>
    request(app)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD });

  describe('POST /api/auth/login', () => {
    it('200: accessToken con sub/email/permissions y cookie httpOnly (Escenario 1)', async () => {
      const res = await login().expect(200);
      const { accessToken, expiresIn } = res.body.data;
      expect(expiresIn).toBe(900);
      const payload = decodePayload(accessToken);
      expect(payload.sub).toBe(userId);
      expect(payload.email).toBe(EMAIL);
      expect(Array.isArray(payload.permissions)).toBe(true);
      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toMatch(/refresh_token=/);
      expect(cookie).toMatch(/HttpOnly/i);
    });

    it('401 con contraseña incorrecta, mismo mensaje que email inexistente (Escenario 5)', async () => {
      const bad = await request(app)
        .post('/api/auth/login')
        .send({ email: EMAIL, password: 'Incorrecta123!' })
        .expect(401);
      const ghost = await request(app)
        .post('/api/auth/login')
        .send({ email: 'no-existe@test.local', password: 'Incorrecta123!' })
        .expect(401);
      expect(bad.body.message ?? bad.body.error).toEqual(
        ghost.body.message ?? ghost.body.error,
      );
    });

    it('422 con body inválido', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'no-es-email', password: '123' })
        .expect(422);
    });

    it('la contraseña jamás se guarda en texto plano', async () => {
      const row = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      expect(row.passwordHash).not.toBe(PASSWORD);
      expect(row.passwordHash).toMatch(/^\$2[aby]\$/);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('200 rota el token: el viejo queda revocado y enlazado al nuevo (Escenario 3)', async () => {
      const res = await login().expect(200);
      const cookie = res.headers['set-cookie'];
      const refreshed = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(200);
      expect(refreshed.body.data.accessToken).toBeTruthy();

      const viejo = await prisma.refreshToken.findFirstOrThrow({
        where: { userId, replacedBy: { not: null } },
      });
      expect(viejo.revokedAt).not.toBeNull();
      const total = await prisma.refreshToken.count({ where: { userId } });
      expect(total).toBe(2);
    });

    it('401 al reusar un token ya rotado y revoca la familia completa (Escenario 2)', async () => {
      const res = await login().expect(200);
      const cookie = res.headers['set-cookie'];
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(200);
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(401);

      const vivos = await prisma.refreshToken.count({
        where: { userId, revokedAt: null },
      });
      expect(vivos).toBe(0);
    });

    it('401 con token expirado', async () => {
      const res = await login().expect(200);
      const cookie = res.headers['set-cookie'];
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(401);
    });

    it('401 sin cookie', async () => {
      await request(app).post('/api/auth/refresh').expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('200: limpia la cookie y el refresh posterior muere', async () => {
      const res = await login().expect(200);
      const cookie = res.headers['set-cookie'];
      const out = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookie)
        .expect(200);
      expect(out.headers['set-cookie'][0]).toMatch(/refresh_token=;/);
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(401);
    });
  });

  describe('DELETE /api/users/:id/sessions', () => {
    it('401 sin bearer token', async () => {
      await request(app).delete(`/api/users/${userId}/sessions`).expect(401);
    });

    it('403 sin el permiso usuario:gestionar', async () => {
      const res = await login().expect(200);
      const { accessToken } = res.body.data;
      await request(app)
        .delete(`/api/users/${randomUUID()}/sessions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
