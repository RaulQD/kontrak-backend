import { Browser } from 'puppeteer';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { logger } from '../../shared/utils/logger';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { getFormattedDate } from '../../shared/utils/data-folder';
import { BaseProcessor } from './base.processor';
import { EmployeeData } from '../../shared/types/employees.interface';

export class SctrReportApeProcessor extends BaseProcessor {
  public readonly name = 'SCTR Report Ape Processor';
  private excelGeneratorService: ExcelGeneratorServices;

  constructor() {
    super();
    this.excelGeneratorService = new ExcelGeneratorServices();
  }

  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    //FILTRAR SOLO POR CONTRATOS TIPO APE
    const apeEmployees = this.filterEmployees(
      employees,
      (emp) => emp.contractType === 'APE',
    );
    this.logProcessing('APE', apeEmployees.length, employees.length);

    const resultReports: ContractResult[] = [];

    if (apeEmployees.length > 0) {
      const apeSctrBuffer =
        await this.excelGeneratorService.generateExcelSctrToApeContract(
          apeEmployees,
        );

      resultReports.push({
        success: true,
        filename: `VG_FORMATO_DE_CARGA_NOMIAL_${getFormattedDate()}.xlsx`,
        buffer: apeSctrBuffer,
        documentType: 'sctr-reports',
      });
    }
    return {
      employees: apeEmployees,
      contracts: resultReports,
    };
  }
}
