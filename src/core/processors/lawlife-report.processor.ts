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

export class LawlifeReportProcessor extends BaseProcessor {
  public readonly name: string = 'Lawlive Report Processor';
  private excelGeneratorService: ExcelGeneratorServices;

  constructor() {
    super();
    this.excelGeneratorService = new ExcelGeneratorServices();
  }
  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    //AGREGAR TODOS LOS CONTRATOS MENOS EL TIPO DE CONTRATO APE
    const employeesWithoutApe = this.filterEmployees(
      employees,
      (emp) => emp.contractType !== 'APE',
    );
    const resultReports: ContractResult[] = [];
    logger.info('Iniciando reporte Vida Ley');
    if (employeesWithoutApe.length > 0) {
      const lawliveStream =
        await this.excelGeneratorService.generateExcelLawLife(
          employeesWithoutApe,
        );
      resultReports.push({
        success: true,
        filename: '1.1 VIDA_LEY TRAMA INV URB OP.xlsx',
        stream: lawliveStream,
        documentType: 'lawlife-reports',
      });
      logger.info('Reporte Vida Ley generado');
    }
    return {
      employees: employeesWithoutApe,
      contracts: resultReports,
    };
  }
}
