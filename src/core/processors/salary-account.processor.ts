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
    try {
      logger.info('Iniciando proceso de Apertura de cuentas sueldo');
      //1 . Descargar la plantilla .xlsm de Onedrive
      const templatePath = `${this.TEMPLATE_FOLDER}/${this.TEMPLATE_FILE}`;
      const templateBuffer =
        await this.storage.downloadFileByPath(templatePath);
      if (templateBuffer.error) {
        throw new AppError('No se encontro la plantilla', NOT_FOUND);
      }
      const filledBuffer = await this.salaryAccountService.updateExcel(
        templateBuffer.buffer,
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
        buffer: filledBuffer,
        documentType: 'salary-account',
      });
      logger.info(
        'Plantilla de apertura de cuentas sueldo actualizada exitosamente',
      );
    } catch (error) {
      logger.error({ error }, 'Error procesando apertura de cuenta sueldo');
      resultReports.push({
        success: false,
        filename: this.TEMPLATE_FILE,
        error: error instanceof Error ? error.message : String(error),
        documentType: 'salary-account',
      });
    }
    return {
      employees,
      contracts: resultReports,
    };
  }
}
