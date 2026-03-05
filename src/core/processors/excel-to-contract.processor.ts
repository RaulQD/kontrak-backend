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
import { Readable } from 'stream';

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
    buffer: Buffer | Readable,
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
      if (
        employee.contractType !== 'APE' &&
        employee.contractType !== 'PRACTICANTE'
      ) {
        // 1. Contrato principal
        const contractResult = await this.pdfService.generateContract(
          employee,
          employee.contractType,
          browser,
        );
        result.push({
          success: true,
          filename: contractResult.filename,
          stream: contractResult.stream,
          documentType: 'contracts',
          contractType: employee.contractType,
        });
      }
      // 2. Anexo — Para todos MENOS APE (Practicante SÍ lo recibe)
      if (employee.contractType !== 'APE') {
        const anexoStream = await generateDocAnexo(employee, browser);
        result.push({
          success: true,
          filename: `${employee.dni}.pdf`,
          stream: anexoStream,
          documentType: 'anexos',
          contractType: employee.contractType,
        });
      }
      // 3. Tratamiento de datos — Para todos MENOS PRACTICANTE (APE sí lo recibe)
      if (employee.contractType !== 'PRACTICANTE') {
        // 3. Tratamiento de datos
        const processingDataStream = await generateProcessingOfPersonalDataPDF(
          employee,
          browser,
        );
        result.push({
          success: true,
          filename: `${employee.dni}.pdf`,
          stream: processingDataStream,
          documentType: 'processing-data',
          contractType: employee.contractType,
        });
      }

      // 4. No sujeto a control — Para todos MENOS PRACTICANTE
      if (employee.contractType !== 'PRACTICANTE') {
        const noSubjectToControlStream =
          await this.pdfService.generateLetterNoSubectToControl(
            employee,
            browser,
          );
        if (noSubjectToControlStream) {
          result.push({
            success: true,
            filename: `${employee.dni}.pdf`,
            stream: noSubjectToControlStream.stream,
            documentType: 'no-subject-to-control',
            contractType: employee.contractType,
          });
        }
      }

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
