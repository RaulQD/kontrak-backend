import { IPasswordHasher } from '../domain/ports/password-hasher.port';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { ITokenSigner } from '../domain/ports/token-signer.port';
import { IUserRepository } from '../domain/ports/user.repository.port';
import {
  AccountLockedError,
  InvalidCredentialsError,
} from '../domain/errors/auth.error';
import { IRefreshTokenGenerator } from '../domain/ports/token-generator.port';
import { RefreshToken } from '../domain/entities/refresh-token.entity';

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokenConfig {
  accessTtlSeconds: number; // 900(15 min)
  refreshTtlSeconds: number; // 604800 (7 días)
}

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly hasher: IPasswordHasher,
    private readonly signer: ITokenSigner,
    private readonly refreshGen: IRefreshTokenGenerator,
    private readonly config: AuthTokenConfig,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const now = new Date();
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.isLocked(now)) {
      throw new AccountLockedError(user.lockedUntil ?? now);
    }
    const passwordOk = await this.hasher.verify(
      input.password,
      user.passwordHash,
    );
    if (!passwordOk) {
      user.registerFailedLogin(now);
      await this.userRepo.save(user);
      throw new InvalidCredentialsError();
    }
    user.ensureActive();

    user.registerSuccessfulLogin();
    await this.userRepo.save(user);

    const accessToken = this.signer.signAccess(
      { sub: user.id },
      this.config.accessTtlSeconds,
    );
    const refreshPlain = this.refreshGen.generate();
    const refreshToken = RefreshToken.issue({
      userId: user.id,
      tokenHash: this.refreshGen.hash(refreshPlain),
      expiresAt: new Date(now.getTime() + this.config.refreshTtlSeconds * 1000),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    await this.refreshRepo.save(refreshToken);
    return {
      accessToken,
      refreshToken: refreshPlain,
      expiresIn: this.config.accessTtlSeconds,
    };
  }
}
