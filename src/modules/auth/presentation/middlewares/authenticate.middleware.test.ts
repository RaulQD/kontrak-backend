import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { ErrorRequestHandler, Express } from 'express';
import request from 'supertest';
import { authenticateMiddleware } from './authenticate.middleware';
import { VerifyAccessUseCase } from '../../application/verify-access.use-case';
import { ITokenSigner } from '../../domain/ports/token-signer.port';
import { IUserRepository } from '../../domain/ports/user.repository.port';
import { VerifiedAccessPayload } from '../../domain/types';
import { requestIdMiddleware } from '../../../../platform/http/middlewares/request-id.middleware';
import { getRequestContext } from '../../../../platform/http/request-context';
import { currentAuditContext } from '../../../../platform/audit/audit-context';

const esperar = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const payloadDe = (sub: string): VerifiedAccessPayload => ({
  sub,
  email: `${sub}@kontrak.com`,
  permissions: [],
  iat: 1_800_000_000,
  exp: 1_800_000_900,
});

describe('authenticateMiddleware: propagación del actor a la auditoría', () => {
  const signer = {
    signAccess: vi.fn<ITokenSigner['signAccess']>(),
    verifyAccess: vi.fn<ITokenSigner['verifyAccess']>(),
  } satisfies ITokenSigner;

  const userRepo = {
    findByEmail: vi.fn<IUserRepository['findByEmail']>(),
    findById: vi.fn<IUserRepository['findById']>(),
    save: vi.fn<IUserRepository['save']>(),
    findPermissionsByUserId:
      vi.fn<IUserRepository['findPermissionsByUserId']>(),
    findAccessStatus: vi.fn<IUserRepository['findAccessStatus']>(),
    markTokensRevoked: vi.fn<IUserRepository['markTokensRevoked']>(),
  } satisfies IUserRepository;

  // Misma cadena que la app real: requestIdMiddleware abre el contexto,
  // authenticate fija el actor y el handler hace de caso de uso que audita.
  const crearApp = (): Express => {
    const app = express();
    app.use(requestIdMiddleware);
    app.get(
      '/auditado',
      authenticateMiddleware(new VerifyAccessUseCase(signer, userRepo)),
      async (req, res) => {
        await esperar(Number(req.query.demora ?? 0));
        res.json({ audit: currentAuditContext(), userId: req.auth?.userId });
      },
    );
    // Lee el contexto en el momento del error para saber si quedó un actor.
    const alFallar: ErrorRequestHandler = (_err, _req, res, _next) => {
      res
        .status(401)
        .json({ actorUserId: getRequestContext()?.actorUserId ?? null });
    };
    app.use(alFallar);
    return app;
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // El token es el sub: 'Bearer user-a' autentica a user-a.
    signer.verifyAccess.mockImplementation((token) => payloadDe(token));
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: true,
      tokensRevokedAt: null,
    });
  });

  it('con un token válido, el caso de uso obtiene actor, IP y correlationId sin recibir req', async () => {
    const res = await request(crearApp())
      .get('/auditado')
      .set('Authorization', 'Bearer user-a')
      .expect(200);

    expect(res.body).toEqual({
      audit: {
        actorUserId: 'user-a',
        ipAddress: expect.stringMatching(/127\.0\.0\.1|::1/),
        correlationId: res.headers['x-request-id'],
      },
      userId: 'user-a',
    });
  });

  it('dos peticiones simultáneas con tokens distintos auditan cada una a su actor', async () => {
    const app = crearApp();

    // La primera termina después que la segunda: si compartieran el contexto,
    // la primera leería a user-b.
    const [a, b] = await Promise.all([
      request(app)
        .get('/auditado?demora=30')
        .set('Authorization', 'Bearer user-a'),
      request(app).get('/auditado').set('Authorization', 'Bearer user-b'),
    ]);

    expect(a.body.audit).toMatchObject({
      actorUserId: 'user-a',
      correlationId: a.headers['x-request-id'],
    });
    expect(b.body.audit).toMatchObject({
      actorUserId: 'user-b',
      correlationId: b.headers['x-request-id'],
    });
  });

  it('si el token se rechaza, no fija ningún actor', async () => {
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: false,
      tokensRevokedAt: null,
    });

    const res = await request(crearApp())
      .get('/auditado')
      .set('Authorization', 'Bearer user-a')
      .expect(401);

    expect(res.body).toEqual({ actorUserId: null });
  });
});
