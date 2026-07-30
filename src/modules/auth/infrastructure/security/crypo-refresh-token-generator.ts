import { createHash, randomBytes } from 'node:crypto';
import { IRefreshTokenGenerator } from '../../domain/ports/token-generator.port';

export class CryptoRefreshTokenGenerator implements IRefreshTokenGenerator {
  generate(): string {
    return randomBytes(32).toString('hex');
  }
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
