export interface IRefreshTokenRepository {
  save(): Promise<void>;
  findByHash(tokenHash: string): Promise<void>;
}
