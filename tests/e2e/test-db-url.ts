import 'dotenv/config';

const DEFAULT_TEST_DB_URL =
  'postgresql://postgres:1234@localhost:5433/kontrak_test';

export const TEST_DB_URL = process.env.TEST_DATABASE_URL || DEFAULT_TEST_DB_URL;

// Los e2e corren migraciones, seed y deleteMany sobre esta base: si apuntara a
// la de desarrollo borrarían datos reales. Solo se acepta una base *_test.
const databaseName = (url: string): string => {
  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));
  } catch {
    return '';
  }
};

if (!databaseName(TEST_DB_URL).endsWith('_test')) {
  throw new Error(
    'TEST_DATABASE_URL debe apuntar a una base cuyo nombre termine en "_test" ' +
      '(por ejemplo kontrak_test). Revisa tu .env.',
  );
}
