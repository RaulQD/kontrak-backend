import { execSync } from 'node:child_process';

const TEST_DB_URL = 'postgresql://postgres:1234@localhost:5433/kontrak_test';

export default function setup() {
  const env = { ...process.env, DATABASE_URL: TEST_DB_URL };
  execSync('pnpm prisma migrate deploy', { env, stdio: 'inherit' });
  execSync('pnpm prisma db seed', { env, stdio: 'inherit' });
}
