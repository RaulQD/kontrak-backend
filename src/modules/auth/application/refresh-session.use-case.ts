import { InvalidRefreshTokenError } from '../domain/errors/auth.error';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IRefreshTokenGenerator } from '../domain/ports/token-generator.port';
import { ITokenSigner } from '../domain/ports/token-signer.port';
import { IUserRepository } from '../domain/ports/user.repository.port';
import { AuthTokenConfig } from './login.use-case';
import { RefreshToken } from '../domain/entities/refresh-token.entity';

export interface RefreshInput {
  refreshToken: string; // el valor plano que viene en la cookie
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}
export interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class RefreshSessionUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly signer: ITokenSigner,
    private readonly refreshGen: IRefreshTokenGenerator,
    private readonly config: AuthTokenConfig,
  ) {}

  async execute(input: RefreshInput): Promise<RefreshOutput> {
    const now = new Date();
    const stored = await this.refreshRepo.findByHash(
      this.refreshGen.hash(input.refreshToken),
    );
    if (!stored) {
      throw new InvalidRefreshTokenError();
    }
    //Se reusa el token que ya fue rotado o revocado -> posible robo -> muere en toda la familia
    if (stored.isRevoked() || stored.replacedBy !== null) {
      await this.refreshRepo.revokeFamily(stored.tokenFamilyId);
      throw new InvalidRefreshTokenError();
    }

    if (stored.isExpired(now)) {
      throw new InvalidRefreshTokenError();
    }
    const user = await this.userRepo.findById(stored.userId);

    if (!user || !user.isActive) {
      await this.refreshRepo.revokeFamily(stored.tokenFamilyId);
      throw new InvalidRefreshTokenError();
    }
    const newPlain = this.refreshGen.generate();
    const newToken = RefreshToken.issue({
      userId: stored.userId,
      tokenHash: this.refreshGen.hash(newPlain),
      tokenFamilyId: stored.tokenFamilyId,
      expiresAt: new Date(now.getTime() + this.config.refreshTtlSeconds * 1000),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    await this.refreshRepo.save(newToken);
    await this.refreshRepo.markReplaced(stored.id, newToken.id);

    const permissions = await this.userRepo.findPermissionsByUserId(user.id);
    const accessToken = this.signer.signAccess(
      {
        sub: user.id,
        email: user.email,
        permissions,
      },
      this.config.accessTtlSeconds,
    );
    return {
      accessToken,
      refreshToken: newPlain,
      expiresIn: this.config.accessTtlSeconds,
    };
  }
}
