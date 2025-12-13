import { config } from '../config';
import { AppErrorCode } from '../constants/app-error-code';
import { BAD_REQUEST, NOT_FOUND } from '../constants/http';
import {
  ContractProcessingResult,
  PDFGenerationError,
  PDFPreviewBase64,
  PDFResult,
} from '../types/contract.types';
import { AppError } from '../utils/app-error';
import { ExcelParserServices } from './excel-parser.service';
import { FileStorageService } from './file-storage.service';
import { PDFGeneratorService } from './pdf-generator.service';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';
import archiver from 'archiver';
import { EmployeeData } from '../types/employees.types';
import { Response } from 'express';
export class ContractService {
  private readonly excelParseServices: ExcelParserServices;
  private readonly fileStorageService: FileStorageService;
  private readonly pdfGeneratorService: PDFGeneratorService;
  constructor() {
    this.excelParseServices = new ExcelParserServices();
    this.fileStorageService = new FileStorageService();
    this.pdfGeneratorService = new PDFGeneratorService();
  }

  async processExcelAndGenerateContracts(
    buffer: Buffer,
  ): Promise<ContractProcessingResult> {
    //VALIDAR excel
    const validationResult = await this.excelParseServices.validateExcel(
      buffer,
      {
        sheetIndex: 0,
        skipEmptyRows: true,
        headerRow: 1,
      },
    );
    if (!validationResult.isValid) {
      throw new AppError(
        'Excel inválido',
        BAD_REQUEST,
        AppErrorCode.BAD_REQUEST,
      );
    }

    // //CREAR LA CARPETA DE SESIÓN
    // const sessionPath = await this.fileStorageService.createSessionFolder();
    // const sessionId = path.basename(sessionPath);
    // //GENERAR Y GUARDAR LOS PDFs PARA CADA EMPLEADO VÁLIDO
    // const pdfResults: PDFResult[] = [];
    // const errors: PDFGenerationError[] = [];

    // for (const employee of validationResult.employees) {
    //   try {
    //     const { buffer: pdfBuffer, filename: fileName } =
    //       await this.pdfGeneratorService.generateContract(
    //         employee,
    //         employee.contractType,
    //       );
    //     //GUARDAR EL PDF EN LA CARPETA DE SESIÓN
    //     const filePath = await this.fileStorageService.savePDF(
    //       sessionPath,
    //       employee.contractType,
    //       fileName,
    //       pdfBuffer,
    //     );
    //     pdfResults.push({
    //       dni: employee.dni,
    //       filename: fileName,
    //       contractType: employee.contractType,
    //       size: pdfBuffer.length,
    //       path: filePath,
    //     });
    //   } catch (error) {
    //     errors.push({
    //       dni: employee.dni,
    //       error: error instanceof Error ? error.message : 'Error desconocido',
    //     });
    //   }
    // }
    // //CALCULAR EL RESUMEN DE LOS CONTARTOS
    // const summary = pdfResults.reduce(
    //   (acc, pdf) => {
    //     acc[pdf.contractType] = (acc[pdf.contractType] || 0) + 1;
    //     return acc;
    //   },
    //   {} as Record<string, number>,
    // );
    // //pROGRAMACI´NO DE LIMPIEZA : BORRAR LOS ARCHIVOS DESPUES DE 5 MINUTOS.
    // setTimeout(() => {
    //   try {
    //     fs.rm(sessionPath, { recursive: true, force: true });
    //     logger.info(`Limpieza automatica: Sessión ${sessionId} eliminada`);
    //   } catch (error) {
    //     console.info(error);
    //   }
    // }, 1800000);

    return {
      // sessionPath,
      // sessionId,
      totalRecords: validationResult.totalRecords,
      validRecords: validationResult.validRecords,
      invalidRecords: validationResult.errors.length,
      // generatedPDFs: pdfResults.length,
      // pdfResults,
      // errors,
      // summary,
      employees: validationResult.employees,
      validationErrors: validationResult.errors,
    };
  }
  async downloadZipStream(response: Response, employee: EmployeeData[]) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(response);

    for (const emp of employee) {
      try {
        const { buffer, filename } =
          await this.pdfGeneratorService.generateContract(
            emp,
            emp.contractType,
          );
        // 2. Definimos el nombre de la carpeta virtual
        // Usamos la misma lógica que tenías: minúsculas y sin espacios
        const folderName = emp.contractType
          .toLocaleLowerCase()
          .replace(/\s+/g, '');

        archive.append(buffer, { name: `${folderName}/${filename}` });
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
    if (result) {
      console.info('Archivo:', result.fileName);
      console.info('Tamaño:', result.buffer.length);
    } else {
      console.info('PDF no encontrado');
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
