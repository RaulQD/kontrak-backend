import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  save(token: RefreshToken): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeFamily(tokenFamilyId: string): Promise<void>;
  markReplaced(tokenId: string, replacedByTokenId: string): Promise<void>;
  revokedAllByUser(userId: string): Promise<number>;
}
