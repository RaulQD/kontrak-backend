import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/ports/password-hasher.port';

const SALT_ROUNDS = 12;

export class BcryptPasswordHasher implements IPasswordHasher {
  async simulateVerify(): Promise<void> {
    await Promise.resolve();
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
