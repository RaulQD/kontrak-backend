import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { Express } from 'express';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/platform/database/prisma';
import { PrismaEmployeeRepository } from '../../src/modules/employees/infrastructure/persistence/repository/employee.repository';
import {
  borrarUsuarios,
  crearUsuarioConRol,
  loginToken,
} from '../helpers/auth';
import {
  borrarEmpleadosFixture,
  crearEmpleadosFixture,
  EmployeeFixture,
  FIXTURE,
} from '../helpers/employee.fixtures';

type Rol = 'HR_ADMIN' | 'HR_ANALYST' | 'MANAGER' | 'EMPLOYEE';
const ROLES: Rol[] = ['HR_ADMIN', 'HR_ANALYST', 'MANAGER', 'EMPLOYEE'];
const email = (rol: Rol) => `e2e-employees-${rol.toLowerCase()}@test.local`;

const SENSIBLES = ['hasChildrenUnder18', 'essaludLifeInsurance'];

interface Item {
  id: string;
  fullName: string;
  [key: string]: unknown;
}

describe('US-020a: consulta y listado de la ficha del empleado', () => {
  let app: Express;
  let fx: EmployeeFixture;
  const userIds: string[] = [];
  const tokens = {} as Record<Rol, string>;

  const get = (path: string, rol: Rol) =>
    request(app).get(path).set('Authorization', `Bearer ${tokens[rol]}`);

  const listar = (
    query: Record<string, string | number>,
    rol: Rol = 'HR_ANALYST',
  ) => get('/api/employees', rol).query(query);

  beforeAll(async () => {
    app = buildApp();
    fx = await crearEmpleadosFixture();
    for (const rol of ROLES) {
      userIds.push(await crearUsuarioConRol(email(rol), rol));
      tokens[rol] = await loginToken(app, email(rol));
    }
  });

  afterAll(async () => {
    await borrarEmpleadosFixture();
    await borrarUsuarios(userIds);
    await prisma.$disconnect();
  });

  describe('Escenario 6: listado paginado con filtros', () => {
    it('page=2&limit=20&status=ACTIVO devuelve 10 elementos y la paginación exacta', async () => {
      const res = await listar({ page: 2, limit: 20, status: 'ACTIVO' }).expect(
        200,
      );

      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 20,
        total: FIXTURE.activos,
        totalPages: 2,
      });
      for (const item of res.body.data as Item[]) {
        expect(item.status).toBe('ACTIVO');
      }
    });

    it('sin parámetros usa page=1 y limit=20, y no cuenta al anulado', async () => {
      const res = await listar({}).expect(200);

      expect(res.body.data).toHaveLength(20);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 20,
        total: FIXTURE.total,
        totalPages: 3,
      });
    });

    it('ningún registro anulado aparece en el listado', async () => {
      const res = await listar({ limit: 100 }).expect(200);
      const ids = (res.body.data as Item[]).map((item) => item.id);

      expect(ids).toHaveLength(FIXTURE.total);
      expect(ids).not.toContain(fx.anulado);
    });

    it('ordena por created_at DESC, id DESC y las páginas no repiten filas', async () => {
      const paginas = await Promise.all(
        [1, 2, 3].map((page) => listar({ page, limit: 20 }).expect(200)),
      );
      const recibidos = paginas.flatMap((res) =>
        (res.body.data as Item[]).map((item) => item.id),
      );

      const filas = await prisma.employee.findMany({
        where: { deletedAt: null },
        select: { id: true, createdAt: true },
      });
      const esperados = filas
        .sort(
          (a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime() ||
            (a.id < b.id ? 1 : -1),
        )
        .map((fila) => fila.id);

      expect(new Set(recibidos).size).toBe(FIXTURE.total);
      expect(recibidos).toEqual(esperados);
    });

    it.each([
      ['limit mayor que 100', { limit: 101 }],
      ['limit 0', { limit: 0 }],
      ['page 0', { page: 0 }],
      ['status fuera del enum', { status: 'JUBILADO' }],
      ['un parámetro desconocido', { orden: 'nombre' }],
    ])('responde 422 con %s', async (_caso, query) => {
      await listar(query).expect(422);
    });
  });

  describe('Escenario 7: búsqueda parcial por nombre y por documento', () => {
    it('search=quispe encuentra a MARIA ELENA por nombre completo, sin distinguir mayúsculas', async () => {
      const res = await listar({ search: 'quispe' }).expect(200);

      expect(res.body.pagination.total).toBe(1);
      expect(res.body.data[0]).toMatchObject({
        id: fx.maria,
        fullName: 'MARIA ELENA QUISPE ROJAS',
      });
    });

    it('search=4050 encuentra a MARIA ELENA por número de documento', async () => {
      const res = await listar({ search: '4050' }).expect(200);

      expect((res.body.data as Item[]).map((item) => item.id)).toEqual([
        fx.maria,
      ]);
    });

    it('sin resultados responde 200 con lista vacía y total 0, nunca 404', async () => {
      const res = await listar({ search: 'zzz' }).expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it.each(['a', ' a '])(
      'search=%j (menos de 2 caracteres) responde 422',
      async (search) => {
        await listar({ search }).expect(422);
      },
    );

    it('los comodines de LIKE se buscan como texto, no como patrón', async () => {
      const res = await listar({ search: '%%' }).expect(200);

      expect(res.body.pagination.total).toBe(0);
    });
  });

  describe('Escenario 8: campos sensibles ocultos sin colaborador:leer_sensible', () => {
    it.each(['HR_ANALYST', 'MANAGER'] as const)(
      '%s no recibe las claves sensibles ni en el detalle ni en el listado',
      async (rol) => {
        const detalle = await get(`/api/employees/${fx.maria}`, rol).expect(
          200,
        );
        const listado = await listar({ limit: 100 }, rol).expect(200);

        for (const clave of SENSIBLES) {
          expect(detalle.body.data).not.toHaveProperty(clave);
          for (const item of listado.body.data as Item[]) {
            expect(item).not.toHaveProperty(clave);
          }
        }
      },
    );

    it('HR_ADMIN recibe ambas claves con su valor', async () => {
      const detalle = await get(
        `/api/employees/${fx.maria}`,
        'HR_ADMIN',
      ).expect(200);
      const listado = await listar({ limit: 100 }, 'HR_ADMIN').expect(200);

      expect(detalle.body.data).toMatchObject({
        hasChildrenUnder18: true,
        essaludLifeInsurance: true,
      });
      for (const item of listado.body.data as Item[]) {
        expect(item).toHaveProperty('hasChildrenUnder18');
        expect(item).toHaveProperty('essaludLifeInsurance');
      }
    });

    it('sin permiso, el repositorio ni siquiera trae esas columnas de la BD', async () => {
      // El mapper solo crea las claves si vienen en la fila: si faltan en la
      // vista, es porque el SELECT no las pidió.
      const repo = new PrismaEmployeeRepository(prisma);
      const vista = await repo.findViewById(fx.maria, {
        includeSensitive: false,
      });
      const pagina = await repo.list(
        { page: 1, limit: 100 },
        { includeSensitive: false },
      );

      for (const clave of SENSIBLES) {
        expect(vista).not.toHaveProperty(clave);
        for (const item of pagina.items) {
          expect(item).not.toHaveProperty(clave);
        }
      }
    });
  });

  describe('Detalle: GET /api/employees/:id', () => {
    it.each(['HR_ADMIN', 'HR_ANALYST', 'MANAGER'] as const)(
      '%s consulta la ficha con fechas YYYY-MM-DD',
      async (rol) => {
        const res = await get(`/api/employees/${fx.maria}`, rol).expect(200);

        expect(res.body.data).toMatchObject({
          id: fx.maria,
          documentNumber: '40506070',
          hireDate: '2025-01-15',
          terminationDate: null,
          status: 'ACTIVO',
        });
      },
    );

    it('el fullName de la API coincide con la columna generada full_name', async () => {
      for (const id of [fx.maria, fx.sinMaterno]) {
        const res = await get(`/api/employees/${id}`, 'HR_ANALYST').expect(200);
        const fila = await prisma.employee.findUniqueOrThrow({
          where: { id },
          select: { fullName: true },
        });

        expect(res.body.data.fullName).toBe(fila.fullName);
      }
      // Fija la decisión: el espacio final se conserva, igual que en la BD.
      const sinMaterno = await get(
        `/api/employees/${fx.sinMaterno}`,
        'HR_ANALYST',
      ).expect(200);
      expect(sinMaterno.body.data.fullName).toBe('JOHN SMITH ');
    });

    it('responde 404 si el id no existe', async () => {
      await get(`/api/employees/${randomUUID()}`, 'HR_ANALYST').expect(404);
    });

    it('responde 404 si el colaborador está anulado', async () => {
      await get(`/api/employees/${fx.anulado}`, 'HR_ADMIN').expect(404);
    });

    it('responde 422 si el id no es un UUID', async () => {
      await get('/api/employees/no-es-un-uuid', 'HR_ANALYST').expect(422);
    });
  });

  describe('Acceso', () => {
    it('responde 401 sin token', async () => {
      await request(app).get('/api/employees').expect(401);
      await request(app).get(`/api/employees/${fx.maria}`).expect(401);
    });

    it('responde 403 a un rol sin colaborador:leer', async () => {
      await listar({}, 'EMPLOYEE').expect(403);
      await get(`/api/employees/${fx.maria}`, 'EMPLOYEE').expect(403);
    });
  });
});
