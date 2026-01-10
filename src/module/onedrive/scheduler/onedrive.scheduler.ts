import cron from 'node-cron';
import { OneDriveServices } from '../services/onedrive.service';
import { logger } from '../../../utils/logger';

export class OneDriveScheduler {
  private isProcessing: boolean = false;
  private oneDriveService: OneDriveServices;
  constructor() {
    this.oneDriveService = new OneDriveServices();
  }
  //Iniciar el scheduler para vigilar y procesar archivos, horario: de lunes a viernes de 8 a 23 horas
  start(cronExpression: string = '*/1 8-23 * * 1-5') {
    cron.schedule(cronExpression, async () => {
      if (this.isProcessing) {
        logger.warn('Proceso anterior aun en ejecucion...');
        return;
      }
      this.isProcessing = true;
      try {
        logger.info('Iniciando revision de OneDrive...');
        await this.oneDriveService.vigilarYProcesar();
      } catch (error) {
        logger.error({ error }, 'Error de OneDriveScheduler');
      } finally {
        this.isProcessing = false;
      }
    });
    logger.info(`Scheduler iniciado con expresion: ${cronExpression}`);
  }
}
