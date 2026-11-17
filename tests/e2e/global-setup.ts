import { execSync } from 'node:child_process';
import { TEST_DB_URL } from './test-db-url';
export default function setup() {
  const env = { ...process.env, DATABASE_URL: TEST_DB_URL };
  execSync('pnpm prisma migrate deploy', { env, stdio: 'inherit' });
  execSync('pnpm prisma db seed', { env, stdio: 'inherit' });
}
