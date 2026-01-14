import { logger } from '../../../shared/utils/logger';
import { EmployeeData } from '../../../shared/types/employees.interface';
import { AppError } from '../../../shared/utils/app-error';
import { config } from '../../../config';
import { NOT_FOUND } from '../../../shared/constants/http';
import { FileStorageService } from '../../../services/file-storage.service';
import { PDFGeneratorService } from './pdf-generator.service';
import path from 'path';
import fs from 'fs/promises';
import archiver from 'archiver';
import { Response } from 'express';
import {
  generateDocAnexo,
  generateProcessingOfPersonalDataPDF,
} from '../templates/contracts';
import { ValidationService } from '../../excel/services/validation.service';
import puppeteer from 'puppeteer';
import { chunk } from '../../../shared/utils/array.utits';
import { PDFPreviewBase64 } from '../../../shared/types/contract.interface';

export class ContractService {
  private readonly BATCH_SIZE = 3;
  private readonly fileStorageService: FileStorageService;
  private readonly pdfGeneratorService: PDFGeneratorService;
  constructor() {
    this.fileStorageService = new FileStorageService();
    this.pdfGeneratorService = new PDFGeneratorService();
  }

  async downloadZipStream(response: Response, employees: EmployeeData[]) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(response);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const batches = chunk(employees, this.BATCH_SIZE);

      for (const batch of batches) {
        // Procesar cada batch en paralelo
        await Promise.all(
          batch.map(async (emp) => {
            try {
              const rootFolder = emp.contractType
                .toLocaleLowerCase()
                .replace(/\s+/g, '');

              if (emp.contractType !== 'APE') {
                // 1. Contrato principal
                const contractResult =
                  await this.pdfGeneratorService.generateContract(
                    emp,
                    emp.contractType,
                    browser,
                  );
                archive.append(contractResult.buffer, {
                  name: `${rootFolder}/${contractResult.filename}`,
                });

                // 2. Anexo
                const anexoBuffer = await generateDocAnexo(emp, browser);
                archive.append(anexoBuffer, {
                  name: `${rootFolder}/Anexos/${emp.dni}.pdf`,
                });
              }

              // 3. Tratamiento de datos (siempre)
              const processingDataBuffer =
                await generateProcessingOfPersonalDataPDF(emp, browser);
              archive.append(processingDataBuffer, {
                name: `${rootFolder}/Tratamiento de datos/${emp.dni}.pdf`,
              });
            } catch (error) {
              if (error instanceof Error) {
                logger.error(`Error con empleado ${emp.dni}: ${error.message}`);
              }
            }
          }),
        );
      }
    } finally {
      await browser.close();
    }

    await archive.finalize();
  }

  async previewContractPdf(
    sessionId: string,
    dni: string,
    format: 'base64' | 'file',
  ) {
    // Reconstruir sessionPath desde sessionId
    const sessionPath = path.join(config.paths.temp, sessionId);
    try {
      await fs.access(sessionPath);
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(`Sesión no encontrada: ${sessionId}`, NOT_FOUND);
      }
    }
    //BUSCAR EL  PDF DEL EMPLEADO EN LA CARPETA DE SESIÓN
    const result = await this.fileStorageService.getPdfByDNI(sessionPath, dni);
    if (!result) {
      throw new AppError(`PDF no encontrado para el DNI: ${dni}`, NOT_FOUND);
    }
    if (format === 'base64') {
      const base64String = result.buffer.toString('base64');
      const response: PDFPreviewBase64 = {
        dni,
        pdfBase64: base64String,
        fileName: result.fileName,
      };
      return response;
    }
    if (format === 'file') {
      return {
        buffer: result.buffer,
        fileName: result.fileName,
      };
    }
  }
}
