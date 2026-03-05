import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import {
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { logger } from '../../shared/utils/logger';
import { BaseProcessor } from './base.processor';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { getFormattedDate } from '../../shared/utils/data-folder';

export class CardIdReportProcessor extends BaseProcessor {
  public readonly name = 'CardIdReportProcessor';
  private excelGeneratorServicec: ExcelGeneratorServices;

  constructor() {
    super();
    this.excelGeneratorServicec = new ExcelGeneratorServices();
  }
  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    logger.info('Iniciando reporte tarjetas');
    const resultReports: ContractResult[] = [];
    if (employees.length > 0) {
      const cardIdStream =
        await this.excelGeneratorServicec.generateExcelCardID(employees);
      resultReports.push({
        success: true,
        filename: `FOTOCHECK_${getFormattedDate()}.csv`,
        stream: cardIdStream,
        documentType: 'card-id-reports',
      });
    }
    return {
      employees: employees,
      contracts: resultReports,
    };
  }
}
