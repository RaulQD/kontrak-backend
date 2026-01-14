import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { logger } from '../../shared/utils/logger';
import { BaseProcessor } from './base.processor';

export class LawlifeReportProcess extends BaseProcessor {
  public readonly name: string = 'Lawlive Report Processor';
  private excelGeneratorServicec: ExcelGeneratorServices;

  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    const resultReports: ContractResult[] = [];
    logger.info('Iniciando reporte Vida Ley');
    if (employees.length > 0) {
      const lawliveBuffer =
        await this.excelGeneratorServicec.generateExcelLawLife(employees);
      resultReports.push({
        success: true,
        filename: 'FORMATO_SCTR.xlsx',
        buffer: lawliveBuffer,
        documentType: 'lawlife-reports',
      });
      logger.info('Reporte SCTR generado');
    }
    return {
      employees,
      contracts: resultReports,
    };
  }
}
