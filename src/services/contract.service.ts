import { config } from '../config';
import { AppErrorCode } from '../constants/app-error-code';
import { NOT_FOUND } from '../constants/http';
import { PDFPreviewBase64 } from '../types/contract.interface';
import { AppError } from '../utils/app-error';
import { FileStorageService } from './file-storage.service';
import { PDFGeneratorService } from './pdf-generator.service';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';
import archiver from 'archiver';
import { EmployeeData } from '../types/employees.interface';
import { Response } from 'express';
import {
  generateDocAnexo,
  generateProcessingOfPresonalDataPDF,
} from '../template/contracts';

export class ContractService {
  private readonly fileStorageService: FileStorageService;
  private readonly pdfGeneratorService: PDFGeneratorService;
  constructor() {
    this.fileStorageService = new FileStorageService();
    this.pdfGeneratorService = new PDFGeneratorService();
  }

  async downloadZipStream(response: Response, employee: EmployeeData[]) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(response);

    for (const emp of employee) {
      try {
        const rootFolder = emp.contractType
          .toLocaleLowerCase()
          .replace(/\s+/g, '');
        const [contractResult, processingOfPresonalDataPDF, anexoDocResult] =
          await Promise.all([
            this.pdfGeneratorService.generateContract(emp, emp.contractType),
            generateProcessingOfPresonalDataPDF(emp),
            generateDocAnexo(emp),
          ]);

        archive.append(contractResult.buffer, {
          name: `${rootFolder}/${contractResult.filename}`,
        });
        archive.append(processingOfPresonalDataPDF, {
          name: `${rootFolder}/Tratamiento de datos/${emp.dni}.pdf`,
        });
        archive.append(anexoDocResult, {
          name: `${rootFolder}/Anexos/${emp.dni}.pdf`,
        });
      } catch (error) {
        if (error instanceof Error) {
          logger.info(`Error con empleado ${emp.dni}: ${error.message}`);
        }
      }
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
        throw new AppError(
          `Sesión no encontrada: ${sessionId}`,
          NOT_FOUND,
          AppErrorCode.NOT_FOUND,
        );
      }
    }
    //BUSCAR EL  PDF DEL EMPLEADO EN LA CARPETA DE SESIÓN
    const result = await this.fileStorageService.getPdfByDNI(sessionPath, dni);
    if (!result) {
      throw new AppError(
        `PDF no encontrado para el DNI: ${dni}`,
        NOT_FOUND,
        AppErrorCode.NOT_FOUND,
      );
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
