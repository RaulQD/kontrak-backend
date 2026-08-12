import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import type { Express } from 'express';
import { createApp } from '../../src/services/app';
import { prisma } from '../../src/platform/database/prisma';

const PASSWORD = 'Password123';
const EMAIL_EMPLOYEE = 'e2e-rbac-employee@test.local';
const EMAIL_ADMIN = 'e2e-rbac-admin@test.local';
// Permiso que EMPLOYEE no tiene en el seed; se le agrega en el Escenario 4.
const PERMISO_NUEVO = 'auditoria:leer_rrhh';

const decodePayload = (jwt: string) =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());

describe('US-008: RBAC con permisos granulares', () => {
  let app: Express;
  let idEmployee: string;
  let idAdmin: string;
  let rolEmployeeId: string;
  let permisoNuevoId: string;

  const crearUsuarioConRol = async (email: string, rol: string) => {
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
    return { userId: user.id, roleId: role.id };
  };

  const login = (email: string) =>
    request(app).post('/api/auth/login').send({ email, password: PASSWORD });

  const loginToken = async (email: string): Promise<string> => {
    const res = await login(email).expect(200);
    return res.body.data.accessToken;
  };

  beforeAll(async () => {
    app = await createApp();
    const employee = await crearUsuarioConRol(EMAIL_EMPLOYEE, 'EMPLOYEE');
    idEmployee = employee.userId;
    rolEmployeeId = employee.roleId;
    idAdmin = (await crearUsuarioConRol(EMAIL_ADMIN, 'SUPER_ADMIN')).userId;
    const permiso = await prisma.permission.findUniqueOrThrow({
      where: { code: PERMISO_NUEVO },
    });
    permisoNuevoId = permiso.id;
  });

  afterAll(async () => {
    // Deshace el permiso extra que agrega el test del Escenario 4
    await prisma.rolePermission.deleteMany({
      where: { roleId: rolEmployeeId, permissionId: permisoNuevoId },
    });
    const ids = [idEmployee, idAdmin];
    await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });
    await prisma.userRole.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  describe('Permisos en el access token', () => {
    it('el token trae exactamente los permisos del rol asignado', async () => {
      const permisosEmployee = decodePayload(
        await loginToken(EMAIL_EMPLOYEE),
      ).permissions;
      expect(permisosEmployee).toContain('perfil:leer');
      expect(permisosEmployee).not.toContain('usuario:gestionar');

      const permisosAdmin = decodePayload(
        await loginToken(EMAIL_ADMIN),
      ).permissions;
      expect(permisosAdmin).toContain('usuario:gestionar');
      expect(permisosAdmin.length).toBeGreaterThan(permisosEmployee.length);
    });
  });

  describe('Middleware requirePermission (Escenario 1)', () => {
    it('403 con el permiso ausente, en lenguaje entendible y sin filtrar el código interno', async () => {
      const token = await loginToken(EMAIL_EMPLOYEE);
      const res = await request(app)
        .delete(`/api/users/${idAdmin}/sessions`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(res.body.message).toBe(
        'No tienes permisos para gestionar usuarios',
      );
      expect(res.body.message).not.toContain('usuario:gestionar');
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('403 incluso sobre sus propias sesiones: el endpoint es solo para admin', async () => {
      const token = await loginToken(EMAIL_EMPLOYEE);
      await request(app)
        .delete(`/api/users/${idEmployee}/sessions`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('200 cuando el rol sí tiene el permiso, y revoca las sesiones del objetivo', async () => {
      await loginToken(EMAIL_EMPLOYEE); // sesión que el admin va a cerrar
      const tokenAdmin = await loginToken(EMAIL_ADMIN);

      const res = await request(app)
        .delete(`/api/users/${idEmployee}/sessions`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);
      expect(res.body.data.revokedCount).toBeGreaterThanOrEqual(1);

      const vivos = await prisma.refreshToken.count({
        where: { userId: idEmployee, revokedAt: null },
      });
      expect(vivos).toBe(0);
    });
  });

  describe('Roles editables sin redeploy (Escenario 4)', () => {
    it('un permiso agregado en role_permissions llega en el siguiente login', async () => {
      const antes = decodePayload(await loginToken(EMAIL_EMPLOYEE)).permissions;
      expect(antes).not.toContain(PERMISO_NUEVO);

      await prisma.rolePermission.create({
        data: { roleId: rolEmployeeId, permissionId: permisoNuevoId },
      });

      const despues = decodePayload(
        await loginToken(EMAIL_EMPLOYEE),
      ).permissions;
      expect(despues).toContain(PERMISO_NUEVO);
    });
  });
});
