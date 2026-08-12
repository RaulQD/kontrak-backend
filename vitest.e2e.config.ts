/* eslint-disable */
// This file is a Vitest runtime config and can be outside the app tsconfig include set;
// ESLint parserOptions.project would otherwise report it as an unlisted TS file.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/e2e/**/*.test.ts'],
    globalSetup: ['tests/e2e/global-setup.ts'],
    // Mismas credenciales que docker-compose; BD dedicada para tests.
    // dotenv NO pisa variables ya definidas, así que esta gana sobre .env
    env: {
      DATABASE_URL: 'postgresql://postgres:1234@localhost:5433/kontrak_test',
    },
    fileParallelism: false,
  },
});
