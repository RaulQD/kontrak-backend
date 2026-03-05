import { Readable } from 'node:stream';
import { Browser } from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';
import {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';
import { logger } from '../../shared/utils/logger';
import { chunk } from '../../shared/utils/array.utits';
import { AddendumData } from '../../shared/types/addendum.interface';
import { PDFGeneratorService } from '../../domain/contracts/services/pdf-generator.service';

export class AddendumContractProcessor implements ContractProcessor {
  public readonly name: string = 'AddendumContractProcessor';
  private readonly BATCH_SIZE: number = 20;
  private readonly pdfService: PDFGeneratorService;

  constructor(pdfService?: PDFGeneratorService) {
    this.pdfService = pdfService ?? new PDFGeneratorService();
  }
  process(
    _buffer: Buffer | Readable,
    _fileName: string,
    _browser: Browser,
  ): Promise<ContractProcessorResult> {
    throw new Error('Method not implemented.');
  }

  async processAddendums(
    addendums: AddendumData[],
    browser: Browser,
  ): Promise<ContractProcessorResult> {
    logger.info(`Procesando ${addendums.length} adendas`);
    const batchSize = chunk(addendums, this.BATCH_SIZE);
    const contracts: ContractResult[] = [];
    for (let i = 0; i < batchSize.length; i++) {
      const batch = batchSize[i];
      logger.info(
        `Batch ${i + 1}/${batchSize.length} (${batch.length} adendas)`,
      );
      const batchResults = await Promise.all(
        batch.map((addendum) => this.processAddendum(addendum, browser)),
      );
      contracts.push(...batchResults);
    }
    return { employees: addendums, contracts };
  }
  private async processAddendum(
    addendum: AddendumData,
    browser: Browser,
  ): Promise<ContractResult> {
    try {
      const { stream, filename } = await this.pdfService.generateAddendumPDF(
        addendum,
        addendum.contractType,
        browser,
      );
      return {
        success: true,
        filename,
        stream,
        documentType: 'addendum',
        addendumType: addendum.contractType,
      };
    } catch (error) {
      logger.error(
        `Error generando adenda para ${addendum.documentNumber}: ${error}`,
      );
      return {
        success: false,
        filename: `ADENDA_${addendum.documentNumber}_error.pdf`,
        error: error instanceof Error ? error.message : String(error),
        documentType: 'addendum',
      };
    }
  }
}
