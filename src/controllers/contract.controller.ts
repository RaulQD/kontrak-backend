import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { catchError } from '../utils/catch-error';
import { BAD_REQUEST, CREATED, OK } from '../constants/http';

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
    const response =
      await this.contractService.processExcelAndGenerateContracts(
        req.file.buffer,
      );

    return res.status(CREATED).json({
      success: true,
      data: response,
    });
  });
  downloadZip = catchError(async (req: Request, res: Response) => {
    const employee = req.body;
    //formatear fecha
    const day = String(new Date().getDate()).padStart(2, '0');
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const year = new Date().getFullYear();
    const formatDate = `${day}-${month}-${year}`;

    res.setHeader('Content-type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename = "contratos-${formatDate}.zip"`,
    );
    await this.contractService.downloadZipStream(res, employee);
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
    return res.status(OK).json({
      success: true,
      data: result, // Aquí va el objeto { dni, pdfBase64, fileName }
    });
  });
}
