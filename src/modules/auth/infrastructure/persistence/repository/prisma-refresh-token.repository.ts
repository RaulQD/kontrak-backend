import type { PrismaClient } from '../../../../../generated/prisma/client';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '../../../domain/ports/refresh-token-repository.port';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async save(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        id: token.id,
        userId: token.userId,
        tokenHash: token.tokenHash,
        tokenFamilyId: token.tokenFamilyId,
        replacedBy: token.replacedBy,
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
        ipAddress: token.ipAddress,
        userAgent: token.userAgent,
      },
    });
  }
  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const row = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    return row ? new RefreshToken(row) : null;
  }
  async revokeFamily(tokenFamilyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenFamilyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
