import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import { Readable } from 'stream';
import { AddendumData } from '../../shared/types/addendum.interface';

/**
 * Resultado del procesamiento de un contrato
 */
export interface ContractResult {
  success: boolean;
  filename: string;
  stream?: Readable;
  error?: string;
  documentType:
    | 'contracts'
    | 'anexos'
    | 'processing-data'
    | 'sctr-reports'
    | 'sctr-ape-reports'
    | 'card-id-reports'
    | 'lawlife-reports'
    | 'salary-account'
    | 'no-subject-to-control'
    | 'insurances-fola'
    | 'addendum';
  contractType?: 'PLANILLA' | 'PART TIME' | 'SUBSIDIO' | 'APE' | 'PRACTICANTE';
  addendumType?: 'POR INICIO O INCREMENTO DE ACTIVIDAD' | 'DE SUPLENCIA';
}

/**
 * Resultado del procesamiento de un archivo Excel
 */
export interface ContractProcessorResult {
  employees: EmployeeData[] | AddendumData[];
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
    buffer: Buffer | Readable,
    fileName: string,
    browser: Browser,
  ): Promise<ContractProcessorResult>;

  processEmployees?(
    employees: EmployeeData[],
    browser: Browser,
  ): Promise<ContractProcessorResult>;
  processAddendums?(
    employees: AddendumData[],
    browser: Browser,
  ): Promise<ContractProcessorResult>;
}
