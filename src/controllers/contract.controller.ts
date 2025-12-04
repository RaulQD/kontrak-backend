import { Request, Response } from 'express';
import { ExcelParserServices } from '../services/excel-parser.service';
import { PDFGeneratorService } from '../services/pdf-generator.service';
import { FileStorageService } from '../services/file-storage.service';
import { logger } from '../validators/logger';
import { PdfGeneratorPupperService } from '../services/pdf-generater-pupper.service';

export class ContractController {
  private excelParserService = new ExcelParserServices();
  private pdfGeneratorService = new PDFGeneratorService();
  private fileStorageService = new FileStorageService();
  private pdfGeneratorPupperService = new PdfGeneratorPupperService();

  /**
   * Procesa un archivo Excel subido y muestra los datos en consola
   */
  uploadAndProcessExcel = async (req: Request, res: Response) => {
    try {
      // Verificar que llegó el archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se recibió ningún archivo. Envía un campo "excel"',
        });
      }
      console.info(req.file);
      logger.info({ filename: req.file.originalname }, '📁 Archivo recibido');

      const buffer = req.file.buffer;
      const data = await this.excelParserService.importExcelFromBuffer(buffer, {
        sheetIndex: 0,
        skipEmptyRows: true,
        headerRow: 1,
      });
      const summary = data.reduce<Record<string, number>>(
        (acc, name) => {
          const type = String(name.contractType || 'sin_tipo');
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      // 6. Retornar respuesta
      return res.status(200).json({
        success: true,
        message:
          'Archivo procesado correctamente. Revisa la consola para ver los datos.',
        data: {
          totalRecords: data.length,
          contractSummary: summary,
          records: data,
        },
      });
    } catch (error) {
      logger.error({ error }, '❌ Error al procesar Excel');
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error al procesar el archivo',
      });
    }
  };

  /**
   * Genera PDFs de contratos desde un archivo Excel validado
   */
  generateContractPDFs = async (req: Request, res: Response) => {
    try {
      // Verificar que llegó el archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se recibió ningún archivo. Envía un campo "excel"',
        });
      }

      logger.info(
        { filename: req.file.originalname },
        '📁 Archivo recibido para generar PDFs',
      );

      // 1. Validar el Excel
      const buffer = req.file.buffer;
      const validationResult = await this.excelParserService.validateExcel(
        buffer,
        {
          sheetIndex: 0,
          skipEmptyRows: true,
          headerRow: 1,
        },
      );

      // 2. Verificar si hay errores de validación
      if (!validationResult.isValid) {
        logger.warn(
          { errors: validationResult.errors.length },
          '⚠️  Datos inválidos en el Excel',
        );
        return res.status(400).json({
          success: false,
          message: 'El archivo Excel contiene errores de validación',
          errors: validationResult.errors,
          stats: {
            totalRecords: validationResult.totalRecords,
            validRecords: validationResult.validRecords,
            invalidRecords: validationResult.invalidRecords,
          },
        });
      }

      logger.info(
        { validRecords: validationResult.validRecords },
        '✅ Datos validados correctamente',
      );

      // 3. Crear carpeta de sesión
      const sessionPath = await this.fileStorageService.createSessionFolder();

      // 4. Generar y guardar PDFs para cada empleado válido
      const pdfResults = [];
      const errors = [];

      for (const employee of validationResult.employees) {
        try {
          const { buffer: pdfBuffer, filename } =
            await this.pdfGeneratorService.generateContract(
              employee,
              employee.contractType,
            );

          // Guardar PDF en disco
          const filePath = await this.fileStorageService.savePDF(
            sessionPath,
            employee.contractType,
            filename,
            pdfBuffer,
          );

          pdfResults.push({
            dni: employee.dni,
            filename,
            contractType: employee.contractType,
            size: pdfBuffer.length,
            path: filePath,
          });
        } catch (error) {
          logger.error(
            { error, dni: employee.dni },
            '❌ Error generando PDF individual',
          );
          errors.push({
            dni: employee.dni,
            error: error instanceof Error ? error.message : 'Error desconocido',
          });
        }
      }

      // 4. Retornar respuesta con resumen
      const summary = pdfResults.reduce(
        (acc, pdf) => {
          acc[pdf.contractType] = (acc[pdf.contractType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      logger.info(
        { totalGenerated: pdfResults.length, totalErrors: errors.length },
        '✅ Proceso de generación completado',
      );

      return res.status(200).json({
        success: true,
        message: `Se generaron ${pdfResults.length} contratos exitosamente`,
        data: {
          sessionPath,
          totalGenerated: pdfResults.length,
          totalErrors: errors.length,
          summary,
          contracts: pdfResults,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      logger.error({ error }, '❌ Error al procesar el archivo y generar PDFs');
      return res.status(500).json({
        success: false,
        message: 'Error al procesar el archivo y generar PDFs',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };
}
