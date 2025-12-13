import { createApp } from './app';
import { config } from './config';
import { Server } from './server';
import { logger } from './utils/logger';
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
    server.listen(Number(config.server.port));
  } catch (error: unknown) {
    logger.error({ error }, 'Error during application initialization');
    process.exit(1);
  }
}
