import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginUseCase } from './login.use-case';
import { User } from '../domain/entities/user.entity';
import { InvalidCredentialsError } from '../domain/errors/auth.error';
import { IPasswordHasher } from '../domain/ports/password-hasher.port';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IRefreshTokenGenerator } from '../domain/ports/token-generator.port';
import { ITokenSigner } from '../domain/ports/token-signer.port';
import { IUserRepository } from '../domain/ports/user.repository.port';

const INPUT = { email: 'admin@kontrak.com', password: 'Incorrecta123!' };

const usuarioActivo = (): User =>
  new User({
    id: 'user-1',
    email: 'admin@kontrak.com',
    passwordHash: '$2a$12$hash-de-prueba',
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastFailedLoginAt: null,
    lockoutsCount: 0,
    isActive: true,
  });

describe('LoginUseCase: anti-enumeración por tiempo', () => {
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

  const hasher = {
    hash: vi.fn<IPasswordHasher['hash']>(),
    verify: vi.fn<IPasswordHasher['verify']>(),
    simulateVerify: vi.fn<IPasswordHasher['simulateVerify']>(),
  } satisfies IPasswordHasher;

  const signer = {
    signAccess: vi.fn<ITokenSigner['signAccess']>(),
    verifyAccess: vi.fn<ITokenSigner['verifyAccess']>(),
  } satisfies ITokenSigner;

  const refreshGen = {
    generate: vi.fn<IRefreshTokenGenerator['generate']>(),
    hash: vi.fn<IRefreshTokenGenerator['hash']>(),
  } satisfies IRefreshTokenGenerator;

  const useCase = new LoginUseCase(
    userRepo,
    refreshRepo,
    hasher,
    signer,
    refreshGen,
    { accessTtlSeconds: 900, refreshTtlSeconds: 604_800 },
  );

  beforeEach(() => {
    vi.resetAllMocks();
    hasher.simulateVerify.mockResolvedValue(undefined);
    hasher.verify.mockResolvedValue(false);
  });

  it('con un email inexistente ejecuta simulateVerify y responde credenciales inválidas', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(INPUT)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(hasher.simulateVerify).toHaveBeenCalledTimes(1);
    expect(hasher.verify).not.toHaveBeenCalled();
  });

  it('con un email inexistente espera a que termine simulateVerify antes de responder', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    let terminarSimulacion!: () => void;
    hasher.simulateVerify.mockReturnValue(
      new Promise<void>((resolve) => {
        terminarSimulacion = resolve;
      }),
    );

    let respondio = false;
    const resultado = useCase.execute(INPUT).catch((error: unknown) => {
      respondio = true;
      return error;
    });
    // Deja correr todas las promesas pendientes salvo la de simulateVerify.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(respondio).toBe(false);

    terminarSimulacion();
    expect(await resultado).toBeInstanceOf(InvalidCredentialsError);
  });

  it('con una contraseña incorrecta verifica el hash real y no simula', async () => {
    userRepo.findByEmail.mockResolvedValue(usuarioActivo());

    await expect(useCase.execute(INPUT)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(hasher.verify).toHaveBeenCalledWith(
      INPUT.password,
      '$2a$12$hash-de-prueba',
    );
    expect(hasher.simulateVerify).not.toHaveBeenCalled();
  });
});
