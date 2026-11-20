import { NotFoundError } from '../../../shared/utils/app-error-v2';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IUserRepository } from '../domain/ports/user.repository.port';

export class DeleteSessionUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshRepository: IRefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<{ revokedCount: number }> {
    const user = await this.userRepository.findById(userId);
    if (user === null) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    const now = new Date();
    await this.userRepository.markTokensRevoked(userId, now);
    const revokedCount = await this.refreshRepository.revokeAllForUser(userId);
    return { revokedCount };
  }
}
