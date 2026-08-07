import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IRefreshTokenGenerator } from '../domain/ports/token-generator.port';

export class LogoutUseCase {
  constructor(
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly refreshGen: IRefreshTokenGenerator,
  ) {}

  async execute(refreshTokenPlain: string): Promise<void> {
    // Implementation for logging out a user
    if (refreshTokenPlain === null || refreshTokenPlain === undefined) {
      return;
    }
    const stored = await this.refreshRepo.findByHash(
      this.refreshGen.hash(refreshTokenPlain),
    );
    if (stored === null) {
      return;
    }
    await this.refreshRepo.revokeFamily(stored.tokenFamilyId);
  }
}
