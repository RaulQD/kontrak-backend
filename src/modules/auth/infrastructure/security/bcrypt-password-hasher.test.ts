import { afterEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import {
  BcryptPasswordHasher,
  DUMMY_HASH,
  SALT_ROUNDS,
} from './bcrypt-password-hasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('DUMMY_HASH tiene el mismo costo que SALT_ROUNDS', () => {
    // Si falla, se cambió SALT_ROUNDS: regenera DUMMY_HASH con el costo nuevo
    // o un email inexistente volverá a responder más rápido que uno real.
    expect(bcrypt.getRounds(DUMMY_HASH)).toBe(SALT_ROUNDS);
  });

  it('simulateVerify ejecuta un bcrypt real contra DUMMY_HASH', async () => {
    const compare = vi.spyOn(bcrypt, 'compare');

    await expect(hasher.simulateVerify()).resolves.toBeUndefined();

    expect(compare).toHaveBeenCalledTimes(1);
    expect(compare).toHaveBeenCalledWith(expect.any(String), DUMMY_HASH);
  });

  it('hash usa SALT_ROUNDS y verify distingue la contraseña correcta', async () => {
    const hash = await hasher.hash('Password123');

    expect(bcrypt.getRounds(hash)).toBe(SALT_ROUNDS);
    await expect(hasher.verify('Password123', hash)).resolves.toBe(true);
    await expect(hasher.verify('Incorrecta123!', hash)).resolves.toBe(false);
  });
});
