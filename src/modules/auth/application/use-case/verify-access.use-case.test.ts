import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerifyAccessUseCase } from './verify-access.use-case';
import { IUserRepository } from '../ports/user.repository.port';
import { UserAccessStatus, VerifiedAccessPayload } from '../../domain/types';
import { ITokenSigner } from '../ports/token-signer.port';
import {
  AccessRevokedError,
  AccessTokenExpiredError,
} from '../../domain/errors/auth.error';

// iat del token: 2026-11-19T10:00:00Z, en segundos como lo emite jsonwebtoken.
const IAT = Date.UTC(2026, 10, 19, 10, 0, 0) / 1000;

const PAYLOAD: VerifiedAccessPayload = {
  sub: 'user-1',
  email: 'admin@kontrak.com',
  permissions: ['usuario:gestionar'],
  iat: IAT,
  exp: IAT + 900,
};

const ACTIVO: UserAccessStatus = { isActive: true, tokensRevokedAt: null };

const segundosDesdeIat = (segundos: number): Date =>
  new Date((IAT + segundos) * 1000);

describe('VerifyAccessUseCase', () => {
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

  const useCase = new VerifyAccessUseCase(signer, userRepo);

  beforeEach(() => {
    vi.resetAllMocks();
    signer.verifyAccess.mockReturnValue(PAYLOAD);
    userRepo.findAccessStatus.mockResolvedValue(ACTIVO);
  });

  it('devuelve el payload de un usuario activo sin revocaciones', async () => {
    await expect(useCase.execute('token')).resolves.toEqual(PAYLOAD);

    expect(signer.verifyAccess).toHaveBeenCalledWith('token');
    expect(userRepo.findAccessStatus).toHaveBeenCalledWith('user-1');
  });

  it('no consulta la BD si la firma o la expiración fallan', async () => {
    signer.verifyAccess.mockImplementation(() => {
      throw new AccessTokenExpiredError();
    });

    await expect(useCase.execute('token')).rejects.toBeInstanceOf(
      AccessTokenExpiredError,
    );
    expect(userRepo.findAccessStatus).not.toHaveBeenCalled();
  });

  it('rechaza el token si el usuario no existe o fue eliminado', async () => {
    userRepo.findAccessStatus.mockResolvedValue(null);

    await expect(useCase.execute('token')).rejects.toBeInstanceOf(
      AccessRevokedError,
    );
  });

  it('rechaza el token de un usuario desactivado', async () => {
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: false,
      tokensRevokedAt: null,
    });

    await expect(useCase.execute('token')).rejects.toBeInstanceOf(
      AccessRevokedError,
    );
  });

  it('rechaza un token emitido antes de tokensRevokedAt', async () => {
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: true,
      tokensRevokedAt: segundosDesdeIat(60),
    });

    await expect(useCase.execute('token')).rejects.toBeInstanceOf(
      AccessRevokedError,
    );
  });

  it('acepta un token emitido después de tokensRevokedAt', async () => {
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: true,
      tokensRevokedAt: segundosDesdeIat(-60),
    });

    await expect(useCase.execute('token')).resolves.toEqual(PAYLOAD);
  });

  it('acepta un token cuyo iat coincide exactamente con tokensRevokedAt', async () => {
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: true,
      tokensRevokedAt: segundosDesdeIat(0),
    });

    await expect(useCase.execute('token')).resolves.toEqual(PAYLOAD);
  });

  it('rechaza un token del mismo segundo que la revocación: iat se trunca a segundos', async () => {
    // Revocación a las 10:00:00.500; un login a las 10:00:00.800 lleva iat
    // 10:00:00 y se rechaza. Es la ventana de menos de 1 s documentada.
    userRepo.findAccessStatus.mockResolvedValue({
      isActive: true,
      tokensRevokedAt: segundosDesdeIat(0.5),
    });

    await expect(useCase.execute('token')).rejects.toBeInstanceOf(
      AccessRevokedError,
    );
  });
});
