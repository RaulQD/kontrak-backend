import { Browser } from 'puppeteer';
import { FileStorageService } from '../../infrastructure/onedrive/storage';
import { FileValidator } from '../../infrastructure/onedrive/validators';
import { ProcessingPolicy } from './policies/interfaces/processing-policy.interface';
import { DefaultProcessingPolicy } from './policies/default-processing.policy';
import {
  ProcessingResult,
  ProcessingResultFactory,
  ItemProcessingResult,
} from './result/processing-result.interface';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import {
  ExcelToContractProcessor,
  SctrReportApeProcessor,
  SctrReportProcessor,
} from '../processors';

import { GraphEmailService } from '../../infrastructure/email/services/graph-email.service';
import { BrevoEmailService } from '../../infrastructure/email/services/brevo-email.service';
import { EmailNotificationService } from '../notifications/services/email-notification.service';
import { AppError } from '../../shared/utils/app-error';
import { logger } from '../../shared/utils/logger';
import { getOutPutFolders } from '../../shared/utils/data-folder';

/**
 * Metadata mínima del archivo para procesamiento
 */
export interface FileToProcess {
  id: string;
  name: string;
  size: number;
  createdByEmail: string;
  createdByName: string;
}

/**
 * Dependencias del orquestador
 */
export interface OrchestratorDependencies {
  storage: FileStorageService;
  validator: FileValidator;
  excelToContractProcessor: ExcelToContractProcessor;
  sctrProcessor: SctrReportProcessor;
  sctrApeProcessor: SctrReportApeProcessor;
  policy?: ProcessingPolicy;
  emailService: BrevoEmailService;
  excelService: ExcelGeneratorServices;
  emailNotificationService: EmailNotificationService;
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
  private sctrApeProcessor: SctrReportApeProcessor;
  private policy: ProcessingPolicy;
  private excelService: ExcelGeneratorServices;
  private emailService: BrevoEmailService;
  private emailNotificationService: EmailNotificationService;

  constructor(dependencies: OrchestratorDependencies) {
    this.storage = dependencies.storage;
    this.validator = dependencies.validator;
    this.excelToContractProcessor = dependencies.excelToContractProcessor;
    this.policy = dependencies.policy ?? new DefaultProcessingPolicy();
    this.sctrProcessor = dependencies.sctrProcessor;
    this.sctrApeProcessor = dependencies.sctrApeProcessor;
    this.emailService = dependencies.emailService;
    this.excelService = dependencies.excelService;
    this.emailNotificationService = dependencies.emailNotificationService;
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
      const errorMessages = validationResult.errors.map((e) => e.message);
      await this.emailNotificationService.sendValidationFileNotification({
        userName: file.createdByName,
        createdByEmail: file.createdByEmail,
        fileName: file.name,
        errors: errorMessages,
      });
      await this.storage.deleteFile(file.id);
      logger.info(`Archivo eliminado por ser inválido: ${file.name}`);
      return ProcessingResultFactory.failure(
        file.name,
        errorMessages.join(', '),
      );
    }

    try {
      // 2. DESCARGAR
      logger.info(`Descargando: ${file.name}`);
      const downloadResult = await this.storage.downloadFile(file.id);

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
      const [contractResult, sctrResult, sctrApeResult] = await Promise.all([
        this.excelToContractProcessor.processEmployees!(employees, browser),
        this.sctrProcessor.processEmployees!(employees, browser),
        this.sctrApeProcessor.processEmployees!(employees, browser),
      ]);

      // 5. COMBINAR RESULTADOS
      const allResults = [
        ...contractResult.contracts,
        ...sctrResult.contracts,
        ...sctrApeResult.contracts,
      ];
      const uploadResults: ItemProcessingResult[] = [];

      const folder = getOutPutFolders(outPutfolder);

      for (const contract of allResults) {
        if (contract.success && contract.buffer) {
          try {
            let targetFolder: string;
            const subFolder: string =
              contract.contractType === 'PLANILLA'
                ? 'FULL TIME'
                : contract.contractType || 'OTROS';
            switch (contract.documentType) {
              case 'anexos':
                targetFolder = `${folder.contracts}/${subFolder}/anexos`;
                break;
              case 'processing-data':
                targetFolder = `${folder.contracts}/${subFolder}/tratamiento-datos`;
                break;
              case 'sctr-reports':
                targetFolder = folder.sctrReports;
                break;
              default:
                targetFolder = `${folder.contracts}/${subFolder}/contratos`;
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
      //6. ENVIAR EMAILS CON REPORTES SCTR
      const recipientEmail = file.createdByEmail;
      if (sctrResult.contracts.length > 0 && sctrResult.contracts[0].buffer) {
        try {
          await this.emailService.sendEmailWithAttachment({
            from: recipientEmail,
            to: ['gguerra@apparka.pe'],
            cc: ['raul@prodequa.com', 'raulqdkev@gmail.com'],
            subject: 'Reporte SCTR - Kontrak',
            body: `
                  <h1>Reporte SCTR</h1>
                  <p>Adjunto encontrarás el reporte SCTR con ${employees.length} empleados.</p>
                  <p>Fecha de generación: ${new Date().toLocaleDateString('es-PE')}</p>
                `,
            attachment: {
              filename: `FORMATO_SCTR.xlsx`,
              content: sctrResult.contracts[0].buffer,
            },
          });
          logger.info('Email SCTR enviado');
        } catch (error) {
          logger.error(`Error enviando email SCTR: ${error}`);
          uploadResults.push({
            success: false,
            filename: 'EMAIL_SCTR',
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      if (
        sctrApeResult.contracts.length > 0 &&
        sctrApeResult.contracts[0].buffer
      ) {
        try {
          const response = await this.emailService.sendEmailWithAttachment({
            from: recipientEmail,
            to: ['raul@prodequa.com'],
            cc: ['i201911176@cibertec.edu.pe'],
            subject: 'Reporte SCTR para APE - Kontrak',
            body: `
                  <h1>Reporte SCTR</h1>
                  <p>Adjunto encontrarás el reporte SCTR con ${employees.length} empleados.</p>
                  <p>Fecha de generación: ${new Date().toLocaleDateString('es-PE')}</p>
                `,
            attachment: {
              filename: `FORMATO_SCTR.xlsx`,
              content: sctrApeResult.contracts[0].buffer,
            },
          });
          logger.info('Email SCTR enviado');
        } catch (error) {
          logger.error(`Error enviando email SCTR: ${error}`);
          uploadResults.push({
            success: false,
            filename: 'EMAIL_SCTR',
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
      // 7. CREAR RESULTADO
      const result = ProcessingResultFactory.success(file.name, uploadResults);
      result.processingTimeMs = Date.now() - startTime;

      // 8. APLICAR POLÍTICA
      if (this.policy.shouldDeleteOriginal(result)) {
        logger.info(`Eliminando archivo original: ${file.name}`);
        await this.storage.deleteFile(file.id);
      } else if (result.failureCount > 0) {
        logger.warn(
          `No se elimina ${file.name} porque hubo ${result.failureCount} fallos`,
        );
      }

      logger.info(
        `Procesamiento completado: ${result.successCount}/${result.totalProcessed} exitosos`,
      );
      //9- ENVIAR NOTIFICACION
      if (result.failureCount === 0) {
        // Contar contratos por tipo
        const contractStats = {
          fullTime: contractResult.contracts.filter(
            (c) =>
              c.contractType === 'PLANILLA' && c.documentType === 'contracts',
          ).length,
          partTime: contractResult.contracts.filter(
            (c) =>
              c.contractType === 'PART TIME' && c.documentType === 'contracts',
          ).length,
          subsidio: contractResult.contracts.filter(
            (c) =>
              c.contractType === 'SUBSIDIO' && c.documentType === 'contracts',
          ).length,
          apeTratamientoDatos: contractResult.contracts.filter(
            (c) =>
              c.contractType === 'APE' && c.documentType === 'processing-data',
          ).length,
        };

        logger.info(`Enviando notificacion de exito: ${file.name}`);
        await this.emailNotificationService.sendSuccessNotificacion({
          userName: file.createdByEmail.split('@')[0],
          createdByEmail: file.createdByEmail,
          fileName: file.name,
          totalEmployees: employees.length,
          contracts: contractStats,
        });
      }
      return result;
    } catch (error) {
      logger.error(`Error procesando ${file.name}: ${error}`);
      // Verificar si es un error de validación del Excel
      if (error instanceof AppError && error.data?.validationErrors) {
        logger.info(`Enviando notificacion de validacion: ${file.name}`);
        await this.emailNotificationService.sendValidationErrorNotification({
          userName: file.createdByName,
          createdByEmail: file.createdByEmail,
          fileName: file.name,
          errors: error.data.validationErrors,
        });
      }
      await this.storage.deleteFile(file.id);
      logger.info(`Archivo eliminado por errores: ${file.name}`);

      return ProcessingResultFactory.failure(
        file.name,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
