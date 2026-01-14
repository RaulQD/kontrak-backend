import { OneDriveStorageAdapter } from '../adapters/onedrive-storage.adapter';
import { BrowserManager } from '../../browser/browser-manager';
import { ExcelFileValidator } from '../validators/implementations/excel-file.validator';
import { FileStorageService } from '../storage';
import { FileValidator } from '../validators';
import {
  DefaultProcessingPolicy,
  FileProcessingOrchestrator,
  FileToProcess,
} from '../../../core/orchestration';
import {
  ExcelToContractProcessor,
  SctrReportProcessor,
  SctrReportApeProcessor,
} from '../../../core/processors';
import { ServiceContainer } from '../../../config/service.container';
import { logger } from '../../../shared/utils/logger';

/**
 * OneDrive Service - Ahora es un simple SCHEDULER
 * Solo se encarga de:
 * 1. Listar archivos en OneDrive
 * 2. Delegar el procesamiento al Orquestador
 *
 * Toda la lógica de procesamiento está en FileProcessingOrchestrator
 */
export class OneDriveServices {
  private enterFile: string;
  private outFile: string;
  private storage: FileStorageService;
  private browserManager: BrowserManager;
  private orchestrator: FileProcessingOrchestrator;
  private validator: FileValidator;

  constructor(storage?: FileStorageService, validator?: FileValidator) {
    this.enterFile = 'subir excel';
    this.outFile = 'contratos';
    this.storage = storage ?? new OneDriveStorageAdapter();
    this.validator = validator ?? new ExcelFileValidator();
    this.browserManager = BrowserManager.getInstance();

    // Crear orquestador con todas las dependencias
    const servicesContainer = ServiceContainer.getInstance();
    this.orchestrator = new FileProcessingOrchestrator({
      storage: this.storage,
      validator: validator ?? new ExcelFileValidator(),
      excelToContractProcessor: new ExcelToContractProcessor(),
      policy: new DefaultProcessingPolicy(),
      sctrProcessor: new SctrReportProcessor(),
      sctrApeProcessor: new SctrReportApeProcessor(),
      emailService: servicesContainer.emailService,
      excelService: servicesContainer.excelService,
      emailNotificationService: servicesContainer.emailNotificationService,
    });
  }

  /**
   * Método principal: busca archivos y delega al orquestador
   */
  public async vigilarYProcesar(): Promise<void> {
    logger.info('Buscando archivos en OneDrive...');

    try {
      const browser = await this.browserManager.getBrowser();
      const files = await this.storage.getFiles(this.enterFile);

      if (!files || files.length === 0) {
        logger.info('No hay archivos para procesar');
        return;
      }

      logger.info(`Se encontraron ${files.length} archivos para procesar`);

      // Procesar cada archivo usando el orquestador
      for (const file of files) {
        const fileToProcess: FileToProcess = {
          id: file.id,
          name: file.name,
          size: file.size,
          createdByEmail: file.createdByEmail,
          createdByName: file.createdByName,
        };

        // El orquestador maneja TODO: validar, procesar, subir, eliminar
        await this.orchestrator.processFile(
          fileToProcess,
          browser,
          this.outFile,
        );
      }
    } catch (error) {
      logger.error(`Error en vigilancia: ${error}`);
    } finally {
      await this.browserManager.closeBrowser();
      logger.info('Proceso finalizado');
    }
  }
}
