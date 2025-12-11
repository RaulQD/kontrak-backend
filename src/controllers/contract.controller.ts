import { Request, Response } from 'express';
import { ExcelParserServices } from '../services/excel-parser.service';
import { PDFGeneratorService } from '../services/pdf-generator.service';
import { FileStorageService } from '../services/file-storage.service';
import { logger } from '../validators/logger';
import { ContractService } from '../services/contract.service';
import { catchError } from '../utils/catch-error';
import { BAD_REQUEST } from '../constants/http';

export class ContractController {
  private readonly contractService: ContractService;
  constructor() {
    this.contractService = new ContractService();
  }
  /**
   * Genera PDFs de contratos desde un archivo Excel validado
   */
  generateContractPDFs = catchError(async (req: Request, res: Response) => {
    // Verificar que llegó el archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo. Envía un campo "excel"',
      });
    }
    const result = await this.contractService.processExcelAndGenerateContracts(
      req.file.buffer,
    );

    return res.status(200).json({
      success: true,
      message: `Se generaron ${result.pdfResults.length} contratos exitosamente`,
      data: result,
    });
  });
  previewContractPdf = catchError(async (req: Request, res: Response) => {
    const { dni } = req.params;
    const { sessionId, format } = req.query;
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: 'sessionId es requerido como query parameter',
      });
    }
    const validFormat = format === 'base64' ? 'base64' : 'file';
    if (format && format !== 'base64' && format !== 'file') {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: 'Formato inválido. Use "base64" o "file"',
      });
    }
    const result = await this.contractService.previewContractPdf(
      sessionId,
      dni,
      format as 'base64' | 'file',
    );
    if (validFormat === 'file') {
      const fileResult = result as { buffer: Buffer; fileName: string };
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': fileResult.buffer.length.toString(),
        'Content-Disposition': `inline; filename="${fileResult.fileName}"`,
      });
      return res.send(fileResult.buffer);
    }
    return res.status(200).json({
      success: true,
      data: result, // Aquí va el objeto { dni, pdfBase64, fileName }
    });
  });
}
