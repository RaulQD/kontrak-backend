import { createApp } from './app';
import { config } from './config';
import { OneDriveServices } from './module/onedrive/services/onedrive.service';
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

    // 🤖 INICIAR BOT DE ONEDRIVE
    logger.info('Arrancando Bot de Vigilancia de OneDrive...');
    const oneDriveBot = new OneDriveServices();

    // Ejecutar cada 30 segundos (30000ms)
    const INTERVALO_MS = 30000; // 30 segundos
    setInterval(async () => {
      logger.info('Iniciando revision periodica de OneDrive...');
      await oneDriveBot.vigilarYProcesar();
    }, INTERVALO_MS);

    logger.info(
      `Bot configurado para revisar OneDrive cada ${INTERVALO_MS / 1000} segundos`,
    );
  } catch (error: unknown) {
    logger.error({ error }, 'Error during application initialization');
    process.exit(1);
  }
}
