import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import {
  ContractProcessor,
  ContractProcessorResult,
} from './contract-processor.interface';
import { logger } from '../../shared/utils/logger';

export abstract class BaseProcessor implements ContractProcessor {
  public abstract readonly name: string;
  process(
    _buffer: Buffer,
    _fileName: string,
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    throw new Error('Method not implemented.');
  }
  abstract processEmployees(
    employees: EmployeeData[],
    browser: Browser,
  ): Promise<ContractProcessorResult>;

  protected logProcessing(type: string, filtered: number, total: number): void {
    logger.info(`${type}: ${filtered} empleados de ${total} total`);
  }
  protected filterEmployees(
    employee: EmployeeData[],
    predicate: (emp: EmployeeData) => boolean,
  ): EmployeeData[] {
    return employee.filter(predicate);
  }
}
