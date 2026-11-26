import bcrypt from 'bcryptjs';
import request from 'supertest';
import type { Express } from 'express';
import { prisma } from '../../src/platform/database/prisma';

export const E2E_PASSWORD = 'Password123';

/** Crea (o reutiliza) un usuario activo con un rol del seed y devuelve su id. */
export const crearUsuarioConRol = async (
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
      // Costo bajo a propósito: solo acelera el test, el login lo verifica igual.
      data: { email, passwordHash: await bcrypt.hash(E2E_PASSWORD, 4) },
    }));
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });
  return user.id;
};

export const loginToken = async (
  app: Express,
  email: string,
): Promise<string> => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password: E2E_PASSWORD })
    .expect(200);
  return res.body.data.accessToken as string;
};

/** Borra los usuarios creados por un test junto con sus sesiones y roles. */
export const borrarUsuarios = async (ids: string[]): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });
  await prisma.userRole.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
};
