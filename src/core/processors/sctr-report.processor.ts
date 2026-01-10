import { Browser } from 'puppeteer';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { ExcelGeneratorServices } from '../../services/excel-generator.service';
import { EmployeeData } from '../../types/employees.interface';
import { logger } from '../../utils/logger';

export class SctrReportProcessor implements ContractProcessor {
  public readonly name: string = 'SCTR Report Processor';
  private excelGeneratorServicec: ExcelGeneratorServices;
  constructor() {
    this.excelGeneratorServicec = new ExcelGeneratorServices();
  }

  async process(
    _buffer: Buffer,
    _fileName: string,
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    throw new Error('Use processEmployees() instead');
  }

  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    //FILTRAR SOLO EMPLEADOS CON SCTR - "SI"
    const sctrEmployees = employees.filter(
      (emp: EmployeeData) =>
        emp.sctr === 'SI' || emp.sctr.toLocaleLowerCase() === 'si',
    );
    logger.info(
      `SCTR: ${sctrEmployees.length} empleados de ${employees.length} total`,
    );
    const resultReports: ContractResult[] = [];

    if (sctrEmployees.length > 0) {
      const sctrBuffer =
        await this.excelGeneratorServicec.generateExcelSCTR(sctrEmployees);

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
