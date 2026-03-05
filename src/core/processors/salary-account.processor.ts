import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import { BaseProcessor } from './base.processor';
import {
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { SalaryAccountService } from '../../domain/excel/services/salary-account.service';
import { FileStorageService } from '../../infrastructure/onedrive/storage';
import { logger } from '../../shared/utils/logger';
import { AppError } from '../../shared/utils/app-error';
import { NOT_FOUND } from '../../shared/constants/http';
import { Readable } from 'stream';

export class SalaryAccountProcessor extends BaseProcessor {
  public readonly name: string = 'SalaryAccountProcessor';
  private readonly salaryAccountService: SalaryAccountService;
  private storage: FileStorageService;
  private readonly TEMPLATE_FOLDER = 'macros';
  private readonly TEMPLATE_FILE =
    'Plantilla_Aperturas_CuentaSueldoyCTS 1.xlsm';

  constructor(storage: FileStorageService) {
    super();
    this.storage = storage;
    this.salaryAccountService = new SalaryAccountService();
  }
  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    const resultReports: ContractResult[] = [];
    const templatePath = `${this.TEMPLATE_FOLDER}/${this.TEMPLATE_FILE}`;
    try {
      logger.info('Iniciando proceso de Apertura de cuentas sueldo');
      //1 . Descargar la plantilla .xlsm de Onedrive
      const templateResult =
        await this.storage.downloadFileByPath(templatePath);
      if (templateResult.error) {
        logger.error(
          `Plantilla no encontrada en OneDrive. Ruta buscada: "${templatePath}". ` +
            `Verifica que el archivo exista en la carpeta "macros" de OneDrive.`,
        );
        throw new AppError(
          `Plantilla no encontrada: "${templatePath}"`,
          NOT_FOUND,
        );
      }

      const templateBuffer = templateResult.buffer;
      const filledBuffer = await this.salaryAccountService.updateExcel(
        templateBuffer,
        employees,
      );
      await this.storage.uploadFile(
        filledBuffer,
        this.TEMPLATE_FOLDER,
        this.TEMPLATE_FILE,
      );
      resultReports.push({
        success: true,
        filename: this.TEMPLATE_FILE,
        stream: Readable.from(filledBuffer),
        documentType: 'salary-account',
      });
      logger.info(
        'Plantilla de apertura de cuentas sueldo actualizada exitosamente',
      );
    } catch (error) {
      const isNotFound = (error as any)?.statusCode === 404;
      const isInvalidArg = (error as any)?.code === 'ERR_INVALID_ARG_TYPE';
      const rawMessage = error instanceof Error ? error.message : String(error);
      let friendlyMessage: string;
      if (isNotFound || isInvalidArg) {
        friendlyMessage =
          `No se pudo descargar la plantilla de OneDrive. ` +
          `Ruta esperada: "${templatePath}". ` +
          `Asegúrate de que el archivo "${this.TEMPLATE_FILE}" exista en la carpeta "${this.TEMPLATE_FOLDER}".`;
      } else {
        friendlyMessage = `Error inesperado al procesar apertura de cuenta sueldo: ${rawMessage}`;
      }
      logger.error(friendlyMessage);
      resultReports.push({
        success: false,
        filename: this.TEMPLATE_FILE,
        error: friendlyMessage,
        documentType: 'salary-account',
      });
    }
    return {
      employees,
      contracts: resultReports,
    };
  }
}
