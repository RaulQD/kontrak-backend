import { createApp } from './services/app';
import { OneDriveScheduler } from './infrastructure/onedrive/scheduler/onedrive.scheduler';
import { Server } from './server';
import { logger } from './shared/utils/logger';
import { env } from './platform/config/env';
// Ejecutar aplicación
(async () => {
  await main();
})();

async function main(): Promise<void> {
  try {
    logger.info('Creando aplicacion Express...');
    const app = await createApp();
    logger.info('Inicializando servidor...');
    const server = new Server(app);
    server.listen(Number(env.PORT));
    if (process.env.ONEDRIVE_ENABLED === 'true') {
      const oneDriveScheduler = new OneDriveScheduler();
      oneDriveScheduler.start();
    }
  } catch (error: unknown) {
    logger.error({ error }, 'Error during application initialization');
    process.exit(1);
  }
}
