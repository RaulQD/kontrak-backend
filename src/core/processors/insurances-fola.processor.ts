import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import { BaseProcessor } from './base.processor';
import {
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';

export class InsurancesFolaProcessor extends BaseProcessor {
  public readonly name = 'CardIdReportProcessor';
  private excelGeneratorService: ExcelGeneratorServices;
  constructor() {
    super();
    this.excelGeneratorService = new ExcelGeneratorServices();
  }
  async processEmployees(
    employees: EmployeeData[],
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    const employeeAPE = this.filterEmployees(
      employees,
      (emp) => emp.contractType === 'APE',
    );
    this.logProcessing('APE', employeeAPE.length, employees.length);
    const resultReports: ContractResult[] = [];

    if (employeeAPE.length > 0) {
      const folaStream =
        await this.excelGeneratorService.generateInsurancesFola(employeeAPE);
      resultReports.push({
        success: true,
        filename: '1.2 SEGURO_FOLA.xlsx',
        stream: folaStream,
        documentType: 'insurances-fola',
      });
    }
    return {
      employees: employeeAPE,
      contracts: resultReports,
    };
  }
}
