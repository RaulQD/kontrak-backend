import { Browser } from 'puppeteer';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { EmployeeData } from '../../shared/types/employees.interface';
import { logger } from '../../shared/utils/logger';
import { BaseProcessor } from './base.processor';

export class SctrReportProcessor extends BaseProcessor {
  public readonly name = 'SCTR Report Processor';
  private excelGeneratorService: ExcelGeneratorServices;

  constructor() {
    super();
    this.excelGeneratorService = new ExcelGeneratorServices();
  }

  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    //FILTRAR SOLO EMPLEADOS CON SCTR - "SI" y que el tipo de contrato no sea APE
    const sctrEmployees = this.filterEmployees(
      employees,
      (emp) => emp.sctr === 'SI' && emp.contractType !== 'APE',
    );
    this.logProcessing('SCTR', sctrEmployees.length, employees.length);

    const resultReports: ContractResult[] = [];

    if (sctrEmployees.length > 0) {
      const sctrBuffer =
        await this.excelGeneratorService.generateExcelSCTR(sctrEmployees);

      resultReports.push({
        success: true,
        filename: 'FORMATO_SCTR.xlsx',
        buffer: sctrBuffer,
        documentType: 'sctr-reports',
      });
      logger.info('Reporte SCTR generado');
    }
    return {
      employees: sctrEmployees,
      contracts: resultReports,
    };
  }
}
