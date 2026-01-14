import { Browser } from 'puppeteer';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { PDFGeneratorService } from '../../domain/contracts/services/pdf-generator.service';
import {
  generateDocAnexo,
  generateProcessingOfPersonalDataPDF,
} from '../../domain/contracts/templates/contracts';
import { logger } from '../../shared/utils/logger';
import { chunk } from '../../shared/utils/array.utits';
import { EmployeeData } from '../../shared/types/employees.interface';

/**
 * Procesador que convierte archivos Excel en contratos PDF
 * Implementa ContractProcessor para ser inyectable
 */
export class ExcelToContractProcessor implements ContractProcessor {
  public readonly name = 'ExcelToContractProcessor';
  private readonly BATCH_SIZE = 3;
  private excelService: ExcelGeneratorServices;
  private pdfService: PDFGeneratorService;

  constructor(
    excelService?: ExcelGeneratorServices,
    pdfService?: PDFGeneratorService,
  ) {
    this.excelService = excelService ?? new ExcelGeneratorServices();
    this.pdfService = pdfService ?? new PDFGeneratorService();
  }

  async process(
    buffer: Buffer,
    fileName: string,
    browser: Browser,
  ): Promise<ContractProcessorResult> {
    // 1. Parsear Excel
    const parseResult = await this.excelService.processingExcel(
      buffer,
      fileName,
    );
    return this.processEmployees(parseResult.employees, browser);
  }

  async processEmployees(
    employees: EmployeeData[],
    browser: Browser,
  ): Promise<ContractProcessorResult> {
    logger.info(`Procesando ${employees.length} empleados para contratos`);
    // 2. Generar PDFs para cada empleado
    const batches = chunk(employees, this.BATCH_SIZE);
    const contracts: ContractResult[] = [];

    logger.info(
      `Procesando en lote de ${batches.length} batches de ${this.BATCH_SIZE} empleados`,
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResult = await Promise.all(
        batch.map((employee) => this.processEmployee(browser, employee)),
      );
      for (const result of batchResult) {
        contracts.push(...result);
      }
    }

    return {
      employees,
      contracts,
    };
  }
  private async processEmployee(
    browser: Browser,
    employee: EmployeeData,
  ): Promise<ContractResult[]> {
    const result: ContractResult[] = [];
    try {
      if (employee.contractType !== 'APE') {
        // 1. Contrato principal
        const contractResult = await this.pdfService.generateContract(
          employee,
          employee.contractType,
          browser,
        );
        result.push({
          success: true,
          filename: contractResult.filename,
          buffer: contractResult.buffer,
          documentType: 'contracts',
          contractType: employee.contractType,
        });

        // 2. Anexo
        const anexoBuffer = await generateDocAnexo(employee, browser);
        result.push({
          success: true,
          filename: `${employee.dni}.pdf`,
          buffer: anexoBuffer,
          documentType: 'anexos',
          contractType: employee.contractType,
        });
      }
      // 3. Tratamiento de datos
      const processingDataBuffer = await generateProcessingOfPersonalDataPDF(
        employee,
        browser,
      );
      result.push({
        success: true,
        filename: `${employee.dni}.pdf`,
        buffer: processingDataBuffer,
        documentType: 'processing-data',
        contractType: employee.contractType,
      });

      logger.info(`Documentos generados para: ${employee.dni}`);
    } catch (error) {
      result.push({
        success: false,
        filename: `${employee.dni}_error`,
        error: error instanceof Error ? error.message : String(error),
        documentType: 'contracts',
      });

      logger.error(`Error generando PDF para ${employee.dni}: ${error}`);
    }
    return result;
  }
}
