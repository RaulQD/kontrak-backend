import { Browser } from 'puppeteer';
import { EmployeeData } from '../../types/employees.interface';

/**
 * Resultado del procesamiento de un contrato
 */
export interface ContractResult {
  success: boolean;
  filename: string;
  buffer?: Buffer;
  error?: string;
  documentType: 'contracts' | 'anexos' | 'processing-data' | 'sctr-reports'; // ← NUEVO
}

/**
 * Resultado del procesamiento de un archivo Excel
 */
export interface ContractProcessorResult {
  employees: EmployeeData[];
  contracts: ContractResult[];
}

/**
 * Interfaz para procesadores de contratos
 * Abstrae la conversión de datos a PDFs
 */
export interface ContractProcessor {
  /**
   * Nombre identificador del procesador
   */
  readonly name: string;

  /**
   * Procesa un archivo y genera contratos
   * @param buffer Buffer del archivo (Excel)
   * @param fileName Nombre del archivo
   * @param browser Instancia del browser para PDF
   * @returns Resultados del procesamiento
   */
  process(
    buffer: Buffer,
    fileName: string,
    browser: Browser,
  ): Promise<ContractProcessorResult>;

  processEmployees?(
    employees: EmployeeData[],
    browser: Browser,
  ): Promise<ContractProcessorResult>;
}
