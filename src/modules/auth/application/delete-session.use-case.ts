import { NotFoundError } from '../../../shared/utils/app-error-v2';
import { IRefreshTokenRepository } from '../domain/ports/refresh-token-repository.port';
import { IUserRepository } from '../domain/ports/user.repository.port';

export class DeleteSessionUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<{ revokedCount: number }> {
    const user = await this.userRepo.findById(userId);
    if (user === null) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    const revokedCount = await this.refreshRepo.revokeAllForUser(userId);
    return { revokedCount };
  }
}
