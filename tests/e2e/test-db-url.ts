import 'dotenv/config';

export const TEST_DB_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:1234@localhost:5433/kontrak_test';
