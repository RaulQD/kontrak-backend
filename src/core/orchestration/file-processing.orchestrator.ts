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
import { LawlifeReportProcessor } from '../processors/lawlife-report.processor';
import { CardIdReportProcessor } from '../processors/card-id-report.processor';
import { SalaryAccountProcessor } from '../processors/salary-account.processor';

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
  lawlifeProcessor: LawlifeReportProcessor;
  cardIdProcessor: CardIdReportProcessor;
  salaryAccountProcessor: SalaryAccountProcessor;
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
  private lawlifeProcessor: LawlifeReportProcessor;
  private cardIdProcessor: CardIdReportProcessor;
  private salaryAccountProcessor: SalaryAccountProcessor;
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
    this.lawlifeProcessor = dependencies.lawlifeProcessor;
    this.cardIdProcessor = dependencies.cardIdProcessor;
    this.salaryAccountProcessor = dependencies.salaryAccountProcessor;
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
      const [
        contractResult,
        sctrResult,
        sctrApeResult,
        lawlifeResult,
        cardIdResult,
      ] = await Promise.all([
        this.excelToContractProcessor.processEmployees!(employees, browser),
        this.sctrProcessor.processEmployees!(employees, browser),
        this.sctrApeProcessor.processEmployees!(employees, browser),
        this.lawlifeProcessor.processEmployees!(employees, browser),
        this.cardIdProcessor.processEmployees!(employees, browser),
        this.salaryAccountProcessor.processEmployees!(employees, browser),
      ]);

      // 5. COMBINAR RESULTADOS
      const allResults = [
        ...contractResult.contracts,
        ...sctrResult.contracts,
        ...sctrApeResult.contracts,
        ...lawlifeResult.contracts,
        ...cardIdResult.contracts,
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
                targetFolder = folder.sctr;
                break;
              case 'sctr-ape-reports':
                targetFolder = folder.sctrApe;
                break;
              case 'lawlife-reports':
                targetFolder = folder.lawlife;
                break;
              case 'card-id-reports':
                targetFolder = folder.cardId;
                break;
              // 👇 AGREGAR ESTE CASO:
              case 'no-subject-to-control':
                targetFolder = folder.noSubjectToControl;
                break;

              case 'salary-account':
                continue;
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
      // 6. ENVIAR EMAILS CON REPORTES
      await this.sendNotificationEmail({
        recipientEmail: file.createdByEmail,
        employeesCount: employees.length,
        sctrBuffer: sctrResult.contracts[0]?.buffer,
        sctrApeBuffer: sctrApeResult.contracts[0]?.buffer,
        uploadResults,
      });
      // 7. CREAR RESULTADO
      const result = ProcessingResultFactory.success(file.name, uploadResults);
      result.processingTimeMs = Date.now() - startTime;

      // 8. APLICAR POLÍTICA
      if (this.policy.shouldDeleteOriginal(result)) {
        logger.info(`Eliminando archivo original: ${file.name}`);
        await this.storage.deleteFile(file.id);
        logger.info(`Archivo original eliminado: ${file.name}`);
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
  /**
   * Envía email con los reportes generados (SCTR, SCTR APE, etc.)
   */
  private async sendNotificationEmail(params: {
    recipientEmail: string;
    employeesCount: number;
    sctrBuffer: Buffer | undefined;
    sctrApeBuffer: Buffer | undefined;
    uploadResults: ItemProcessingResult[];
  }): Promise<void> {
    const {
      recipientEmail,
      employeesCount,
      sctrBuffer,
      sctrApeBuffer,
      uploadResults,
    } = params;

    // Enviar reporte SCTR
    if (sctrBuffer && sctrBuffer.length > 0) {
      await this.sendEmail({
        recipientEmail,
        to: ['raul@prodequa.com'],
        cc: ['kevindev2026@outlook.com'],
        subject: 'Reporte SCTR - Kontrak',
        body: this.buildEmailBody('Reporte SCTR', employeesCount),
        attachment: {
          filename: 'FORMATO_SCTR.xlsx',
          content: sctrBuffer,
        },
        reportType: 'SCTR',
        uploadResults,
      });
    }

    // Enviar reporte SCTR APE
    if (sctrApeBuffer && sctrApeBuffer.length > 0) {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      await this.sendEmail({
        recipientEmail,
        to: ['raul@prodequa.com'],
        cc: ['kevindev2026@outlook.com'],
        subject: 'FORMATO DE CARGA NOMINAL',
        body: this.buildEmailBody('Reporte SCTR APE', employeesCount),
        attachment: {
          filename: `VG_FORMATO_DE_CARGA_NOMINAL_${month}_${year}.xlsx`,
          content: sctrApeBuffer,
        },
        reportType: 'FORMATO DE CARGA NOMINAL',
        uploadResults,
      });
    }
  }

  /**
   * Método genérico para enviar email con adjunto
   */
  private async sendEmail(params: {
    recipientEmail: string;
    to: string[];
    cc: string[];
    subject: string;
    body: string;
    attachment: { filename: string; content: Buffer };
    reportType: string;
    uploadResults: ItemProcessingResult[];
  }): Promise<void> {
    const {
      recipientEmail,
      to,
      cc,
      subject,
      body,
      attachment,
      reportType,
      uploadResults,
    } = params;

    try {
      await this.emailService.sendEmailWithAttachment({
        from: recipientEmail,
        to,
        cc,
        subject,
        body,
        attachment,
      });
      logger.info(`Correo electrónico ${reportType} enviado correctamente`);
    } catch (error) {
      logger.error(`Error enviando correo electrónico ${reportType}: ${error}`);
      uploadResults.push({
        success: false,
        filename: `EMAIL_${reportType.replace(/\s+/g, '_').toUpperCase()}`,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Construye el cuerpo HTML del email
   */
  private buildEmailBody(title: string, employeesCount: number): string {
    return `
      <h1>${title}</h1>
      <p>Adjunto encontrarás el reporte con ${employeesCount} empleados.</p>
      <p>Fecha de generación: ${new Date().toLocaleDateString('es-PE')}</p>
    `;
  }
}
