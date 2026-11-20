import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/ports/password-hasher.port';

export const SALT_ROUNDS = 12;

// Hash de una cadena aleatoria con el MISMO costo que las contraseñas reales.
// Solo existe para que un email inexistente tarde lo mismo que una contraseña mala.
export const DUMMY_HASH =
  '$2b$12$T66oZkLwNslokmcPUFjgrejdGn3SoV/bpu3QrFeYg8AtOisIO0Mdi';

export class BcryptPasswordHasher implements IPasswordHasher {
  async simulateVerify(): Promise<void> {
    await bcrypt.compare('simulate-verify', DUMMY_HASH);
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
