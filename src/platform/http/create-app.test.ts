import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { createApp, CreateAppOptions } from './create-app';
import { getRequestId } from './request-context';
import { healthRouter } from './health.route';
import { preserveRequestContext } from './preserve-request-context';
import { NotFoundError } from '../../shared/utils/app-error-v2';
import { AppError as LegacyAppError } from '../../shared/utils/app-error';
import { logger } from '../../shared/utils/logger';

vi.mock('../../shared/utils/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const rutasDePrueba = (): Router => {
  const router = Router();
  router.get('/v2', () => {
    throw new NotFoundError('Empleado', '42');
  });
  router.get('/legacy', () => {
    throw new LegacyAppError('El Excel tiene errores', 400, {
      validationErrors: [{ row: 3, field: 'dni', message: 'DNI inválido' }],
    });
  });
  router.get('/zod', () => {
    z.object({ dni: z.string() }).parse({});
  });
  router.get('/boom', () => {
    throw new Error('detalle interno que no debe llegar al cliente');
  });
  router.get('/request-id', (_req, res) => {
    res.json({ requestId: getRequestId() });
  });
  router.get('/request-id-async', async (_req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    res.json({ requestId: getRequestId() });
  });
  router.post('/request-id', (req, res) => {
    res.json({ requestId: getRequestId(), body: req.body });
  });
  // multer llama a next() desde eventos del stream: sin preserveRequestContext
  // el handler pierde el contexto de la petición.
  router.post(
    '/upload',
    preserveRequestContext(
      multer({ storage: multer.memoryStorage() }).single('archivo'),
    ),
    (req, res) => {
      res.json({ requestId: getRequestId(), nombre: req.file?.originalname });
    },
  );
  router.get('/http-413', () => {
    throw Object.assign(new Error('Cuerpo demasiado grande'), { status: 413 });
  });
  router.get('/http-502', () => {
    throw Object.assign(new Error('detalle del proxy'), { status: 502 });
  });
  router.get('/stream-roto', (_req, res) => {
    res.write('contenido parcial');
    throw new Error('falla a mitad de la descarga');
  });
  return router;
};

const crearApp = (opciones: Partial<CreateAppOptions> = {}) =>
  createApp({
    corsOptions: {},
    checkDatabase: () => Promise.resolve(),
    routes: [{ path: '/test', router: rutasDePrueba() }],
    ...opciones,
  });

describe('createApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('responde 200 cuando la base de datos responde', async () => {
      const checkDatabase = vi.fn().mockResolvedValue([{ '?column?': 1 }]);

      const res = await request(crearApp({ checkDatabase })).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, status: 'ok', database: 'up' });
      expect(checkDatabase).toHaveBeenCalledTimes(1);
    });

    it('responde 503 cuando la base de datos no responde', async () => {
      const checkDatabase = vi
        .fn()
        .mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432'));

      const res = await request(crearApp({ checkDatabase })).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.body).toEqual({
        success: false,
        status: 'error',
        database: 'down',
      });
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });

    it('no la tapa un router registrado en /api', async () => {
      const otro = Router();
      otro.get('/health', (_req, res) => {
        res.json({ legacy: true });
      });
      const checkDatabase = vi.fn().mockResolvedValue(undefined);

      const res = await request(
        crearApp({ checkDatabase, routes: [{ path: '/api', router: otro }] }),
      ).get('/api/health');

      expect(res.body).toEqual({ success: true, status: 'ok', database: 'up' });
      expect(checkDatabase).toHaveBeenCalledTimes(1);
    });

    it('responde 503 si la base de datos no contesta dentro del timeout', async () => {
      const nuncaResponde = () => new Promise<never>(() => {});
      const app = express().use('/api', healthRouter(nuncaResponde, 20));

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.body).toEqual({
        success: false,
        status: 'error',
        database: 'down',
      });
      expect(logger.warn).toHaveBeenCalledWith(
        { err: expect.objectContaining({ message: 'Sin respuesta en 20 ms' }) },
        'Health check: la base de datos no responde',
      );
    });
  });

  describe('404', () => {
    it.each(['get', 'post'] as const)(
      'responde ROUTE_NOT_FOUND para %s a una ruta inexistente',
      async (metodo) => {
        const res = await request(crearApp())[metodo]('/no-existe');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          success: false,
          message: `Route ${metodo.toUpperCase()} /no-existe not found`,
          code: 'ROUTE_NOT_FOUND',
        });
      },
    );
  });

  describe('manejador de errores', () => {
    it('responde un AppError (v2) con su estado y su code', async () => {
      const res = await request(crearApp()).get('/test/v2');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: "Empleado with id '42' not found",
        code: 'NOT_FOUND',
      });
    });

    it('responde un AppError legacy con su estado y su data, no con 500', async () => {
      const res = await request(crearApp()).get('/test/legacy');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: 'El Excel tiene errores',
        data: {
          validationErrors: [{ row: 3, field: 'dni', message: 'DNI inválido' }],
        },
      });
    });

    it('responde un ZodError con 400 y el detalle por campo', async () => {
      const res = await request(crearApp()).get('/test/zod');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual([
        { field: 'dni', message: expect.any(String) },
      ]);
    });

    it('responde 500 genérico ante un error no controlado y lo registra con el requestId', async () => {
      const res = await request(crearApp()).get('/test/boom');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Internal Server Error',
      });
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/test/boom',
          requestId: res.headers['x-request-id'],
        }),
        'Error no controlado',
      );
    });

    it('responde 400 ante un JSON mal formado, no 500', async () => {
      const res = await request(crearApp())
        .post('/test/request-id')
        .set('Content-Type', 'application/json')
        .send('{"dni":');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('respeta el estado 4xx que traen los errores HTTP de librerías', async () => {
      const res = await request(crearApp()).get('/test/http-413');

      expect(res.status).toBe(413);
      expect(res.body).toEqual({
        success: false,
        message: 'Cuerpo demasiado grande',
      });
    });

    it('no respeta un status 5xx de librería: responde el 500 genérico', async () => {
      const res = await request(crearApp()).get('/test/http-502');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Internal Server Error',
      });
    });

    it('si la respuesta ya empezó, registra el error y corta la conexión sin volver a escribir cabeceras', async () => {
      // El socket se cierra a mitad de respuesta: supertest puede rechazar.
      await request(crearApp())
        .get('/test/stream-roto')
        .catch(() => undefined);

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/test/stream-roto',
          requestId: expect.stringMatching(UUID),
        }),
        'Error después de iniciar la respuesta',
      );
    });
  });

  describe('CORS', () => {
    const corsConLista: CreateAppOptions['corsOptions'] = {
      origin: (origin, callback) => {
        if (!origin || origin === 'http://localhost:5173') {
          callback(null, true);
        } else {
          callback(
            Object.assign(new Error('Origen no permitido'), { status: 403 }),
          );
        }
      },
      exposedHeaders: ['X-Request-Id'],
    };

    it('responde 403 a un origen rechazado, no 500', async () => {
      const res = await request(crearApp({ corsOptions: corsConLista }))
        .get('/api/health')
        .set('Origin', 'http://evil.test');

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        success: false,
        message: 'Origen no permitido',
      });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('expone X-Request-Id a un origen permitido', async () => {
      const res = await request(crearApp({ corsOptions: corsConLista }))
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-expose-headers']).toBe('X-Request-Id');
    });
  });

  describe('X-Request-Id', () => {
    it.each([
      ['una respuesta correcta', '/api/health'],
      ['un 404', '/no-existe'],
      ['un error de negocio', '/test/v2'],
      ['un 500', '/test/boom'],
    ])('viene con formato UUID en %s', async (_caso, ruta) => {
      const res = await request(crearApp()).get(ruta);

      expect(res.headers['x-request-id']).toMatch(UUID);
    });

    it('es distinto en cada petición', async () => {
      const app = crearApp();

      const [a, b] = await Promise.all([
        request(app).get('/api/health'),
        request(app).get('/api/health'),
      ]);

      expect(a.headers['x-request-id']).not.toBe(b.headers['x-request-id']);
    });

    it('getRequestId() devuelve el mismo valor que la cabecera', async () => {
      const res = await request(crearApp()).get('/test/request-id');

      expect(res.body.requestId).toBe(res.headers['x-request-id']);
    });

    it('getRequestId() conserva el valor después de un await', async () => {
      const res = await request(crearApp()).get('/test/request-id-async');

      expect(res.body.requestId).toBe(res.headers['x-request-id']);
    });

    it('getRequestId() conserva el valor en un POST con cuerpo JSON', async () => {
      const res = await request(crearApp())
        .post('/test/request-id')
        .send({ dni: '12345678' });

      expect(res.body.body).toEqual({ dni: '12345678' });
      expect(res.body.requestId).toBe(res.headers['x-request-id']);
    });

    it('getRequestId() conserva el valor en una subida multipart con preserveRequestContext', async () => {
      const res = await request(crearApp())
        .post('/test/upload')
        .attach('archivo', Buffer.from('dni;nombre'), 'empleados.csv');

      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('empleados.csv');
      expect(res.body.requestId).toBe(res.headers['x-request-id']);
    });

    it('getRequestId() devuelve undefined fuera de una petición', () => {
      expect(getRequestId()).toBeUndefined();
    });
  });
});
