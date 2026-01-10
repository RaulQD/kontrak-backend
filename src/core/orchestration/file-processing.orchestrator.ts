import { Browser } from 'puppeteer';
import { FileStorageService } from '../../module/onedrive/storage';
import { FileValidator } from '../../module/onedrive/validators';
import { ContractProcessor } from '../processors/contract-processor.interface';
import { ProcessingPolicy } from './policies/interfaces/processing-policy.interface';
import { DefaultProcessingPolicy } from './policies/default-processing.policy';
import {
  ProcessingResult,
  ProcessingResultFactory,
  ItemProcessingResult,
} from './result/processing-result.interface';
import { logger } from '../../utils/logger';
import { NotificationService } from '../notifications/services/notification.service';
import { getOutPutFolders } from '../../utils/data-folder';
import { SctrReportProcessor } from '../processors/sctr-report.processor';
import { ExcelGeneratorServices } from '../../services/excel-generator.service';
import { ExcelToContractProcessor } from '../processors';

/**
 * Metadata mínima del archivo para procesamiento
 */
export interface FileToProcess {
  id: string;
  name: string;
  size: number;
}

/**
 * Dependencias del orquestador
 */
export interface OrchestratorDependencies {
  storage: FileStorageService;
  validator: FileValidator;
  excelToContractProcessor: ExcelToContractProcessor;
  sctrProcessor: SctrReportProcessor;
  policy?: ProcessingPolicy;
  // notificationService: NotificationService;
}

/**
 * Orquestador de procesamiento de archivos
 * Coordina: Validar → Descargar → Procesar → Subir → Decidir
 *
 * Solo COORDINA, delega todo el trabajo a las dependencias inyectadas
 */
export class FileProcessingOrchestrator {
  private storage: FileStorageService;
  private validator: FileValidator;
  private excelToContractProcessor: ExcelToContractProcessor;
  private sctrProcessor: SctrReportProcessor;
  private policy: ProcessingPolicy;
  private excelService: ExcelGeneratorServices;
  // private notificationService: NotificationService;

  constructor(dependencies: OrchestratorDependencies) {
    this.storage = dependencies.storage;
    this.validator = dependencies.validator;
    this.excelToContractProcessor = dependencies.excelToContractProcessor;
    this.policy = dependencies.policy ?? new DefaultProcessingPolicy();
    this.sctrProcessor = dependencies.sctrProcessor;
    this.excelService = new ExcelGeneratorServices();
    // this.notificationService = dependencies.notificationService;
  }

  /**
   * Procesa un archivo completo
   * @param file Metadata del archivo a procesar
   * @param browser Instancia del browser para PDF
   * @param outPutfolder Carpeta donde subir los PDFs generados
   */
  async processFile(
    file: FileToProcess,
    browser: Browser,
    outPutfolder: string,
  ): Promise<ProcessingResult> {
    const startTime = Date.now();

    // 1. VALIDAR
    const validationResult = this.validator.validate({
      name: file.name,
      size: file.size,
    });

    if (!validationResult.isValid) {
      logger.warn(`⏭️ Archivo ignorado por validación: ${file.name}`);
      return ProcessingResultFactory.failure(
        file.name,
        validationResult.errors.map((e) => e.message).join(', '),
      );
    }

    try {
      // 2. DESCARGAR
      logger.info(`Descargando: ${file.name}`);
      const downloadResult = await this.storage.downloadFile(file.id);
      logger.info(` Descargado: ${downloadResult.buffer.length} bytes`);
      if (!downloadResult.buffer) {
        return ProcessingResultFactory.failure(
          file.name,
          downloadResult.error!,
        );
      }
      // 3 parsear excel una sola vez
      const parserResult = await this.excelService.processingExcel(
        downloadResult.buffer,
        file.name,
      );
      const employees = parserResult.employees;
      logger.info(`Excel parseado: ${employees.length} empleados`);

      // 4. PROCESAR EN PARALELO(AMBOS RECIBEN EMPLEADOS PARSEADOS)
      const [contractResult, sctrResult] = await Promise.all([
        this.excelToContractProcessor.processEmployees!(employees, browser),
        this.sctrProcessor.processEmployees!(employees, browser),
      ]);

      // 5. COMBINAR RESULTADOS
      const allResults = [...contractResult.contracts, ...sctrResult.contracts];
      const uploadResults: ItemProcessingResult[] = [];

      const folder = getOutPutFolders(outPutfolder);

      for (const contract of allResults) {
        if (contract.success && contract.buffer) {
          try {
            let targetFolder: string;
            switch (contract.documentType) {
              case 'anexos':
                targetFolder = folder.anexos;
                break;
              case 'processing-data':
                targetFolder = folder.processingData;
                break;
              case 'sctr-reports':
                targetFolder = folder.sctrReports;
                break;
              default:
                targetFolder = folder.contracts;
            }
            await this.storage.uploadFile(
              contract.buffer,
              targetFolder,
              contract.filename,
            );
            uploadResults.push({
              success: true,
              filename: contract.filename,
            });
            logger.info(`Subido: ${targetFolder}/${contract.filename}`);
          } catch (uploadError) {
            uploadResults.push({
              success: false,
              filename: contract.filename,
              error:
                uploadError instanceof Error
                  ? uploadError.message
                  : String(uploadError),
            });
            logger.error(`Error subiendo ${contract.filename}: ${uploadError}`);
          }
        } else {
          uploadResults.push({
            success: false,
            filename: contract.filename || '',
            error: contract.error || '',
          });
        }
      }

      // 6. CREAR RESULTADO
      const result = ProcessingResultFactory.success(file.name, uploadResults);
      result.processingTimeMs = Date.now() - startTime;

      // 7. APLICAR POLÍTICA
      if (this.policy.shouldDeleteOriginal(result)) {
        logger.info(`🗑️ Eliminando archivo original: ${file.name}`);
        await this.storage.deleteFile(file.id);
      } else if (result.failureCount > 0) {
        logger.warn(
          `⚠️ No se elimina ${file.name} porque hubo ${result.failureCount} fallos`,
        );
      }
      // if (result.success) {
      //   await this.notificationService.notifySuccess(file.name, result);
      // } else {
      //   await this.notificationService.notifyError(file.name, result);
      // }
      logger.info(
        `✅ Procesamiento completado: ${result.successCount}/${result.totalProcessed} exitosos`,
      );

      return result;
    } catch (error) {
      logger.error(`❌ Error procesando ${file.name}: ${error}`);
      return ProcessingResultFactory.failure(
        file.name,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
