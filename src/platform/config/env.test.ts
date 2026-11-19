import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const runEnv = (overrides: Record<string, string>) =>
  spawnSync(
    process.execPath,
    ['--import', 'tsx', 'src/platform/config/env.ts'],
    {
      env: { ...process.env, ...overrides },
      encoding: 'utf8',
    },
  );
describe('platform/config/env', () => {
  it('termina con código 1 y nombra la variable si falta DATABASE_URL', () => {
    // Vacía y no ausente: si falta, dotenv la rellena desde tu .env
    const result = runEnv({ DATABASE_URL: '' });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('DATABASE_URL');
  });

  it('nunca muestra el valor de la variable inválida', () => {
    const result = runEnv({ DATABASE_URL: 'mysql://usuario:secreto@host/db' });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('DATABASE_URL');
    expect(result.stderr).not.toContain('secreto');
  });
});
