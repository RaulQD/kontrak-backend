import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteSessionUseCase } from './delete-session.use-case';
import { User } from '../domain/entities/user.entity';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IUserRepository } from '../domain/ports/user.repository.port';
import { NotFoundError } from '../../../shared/utils/app-error-v2';

const AHORA = new Date('2026-11-19T10:00:00.000Z');

const usuario = (): User =>
  new User({
    id: 'user-1',
    email: 'empleado@kontrak.com',
    passwordHash: '$2a$12$hash-de-prueba',
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastFailedLoginAt: null,
    lockoutsCount: 0,
    isActive: true,
  });

describe('DeleteSessionUseCase', () => {
  const userRepo = {
    findByEmail: vi.fn<IUserRepository['findByEmail']>(),
    findById: vi.fn<IUserRepository['findById']>(),
    save: vi.fn<IUserRepository['save']>(),
    findPermissionsByUserId:
      vi.fn<IUserRepository['findPermissionsByUserId']>(),
    findAccessStatus: vi.fn<IUserRepository['findAccessStatus']>(),
    markTokensRevoked: vi.fn<IUserRepository['markTokensRevoked']>(),
  } satisfies IUserRepository;

  const refreshRepo = {
    save: vi.fn<IRefreshTokenRepository['save']>(),
    findByHash: vi.fn<IRefreshTokenRepository['findByHash']>(),
    revokeFamily: vi.fn<IRefreshTokenRepository['revokeFamily']>(),
    markReplaced: vi.fn<IRefreshTokenRepository['markReplaced']>(),
    revokeAllForUser: vi.fn<IRefreshTokenRepository['revokeAllForUser']>(),
  } satisfies IRefreshTokenRepository;

  const useCase = new DeleteSessionUseCase(userRepo, refreshRepo);

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(AHORA);
    userRepo.findById.mockResolvedValue(usuario());
    userRepo.markTokensRevoked.mockResolvedValue(undefined);
    refreshRepo.revokeAllForUser.mockResolvedValue(3);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fija tokensRevokedAt al momento actual y devuelve los refresh tokens revocados', async () => {
    await expect(useCase.execute('user-1')).resolves.toEqual({
      revokedCount: 3,
    });

    expect(userRepo.markTokensRevoked).toHaveBeenCalledWith('user-1', AHORA);
    expect(refreshRepo.revokeAllForUser).toHaveBeenCalledWith('user-1');
  });

  it('corta los access tokens antes de revocar los refresh tokens', async () => {
    await useCase.execute('user-1');

    const [marcaRevocacion] =
      userRepo.markTokensRevoked.mock.invocationCallOrder;
    const [revocaRefresh] =
      refreshRepo.revokeAllForUser.mock.invocationCallOrder;
    expect(marcaRevocacion).toBeLessThan(revocaRefresh);
  });

  it('no revoca nada si el usuario no existe', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('user-1')).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(userRepo.markTokensRevoked).not.toHaveBeenCalled();
    expect(refreshRepo.revokeAllForUser).not.toHaveBeenCalled();
  });
});
