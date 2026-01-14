import { Request, Response } from 'express';
import { ExcelGeneratorServices } from '../../domain/excel/services/excel-generator.service';
import { CREATED } from '../../shared/constants/http';
import { ImageGeneratorService } from '../../domain/contracts/services/image-generator.service';
import { catchError } from '../../shared/utils/catch-error';

export class ExcelController {
  private generateExcelService: ExcelGeneratorServices;
  private imageGeneratorService: ImageGeneratorService;
  constructor() {
    this.generateExcelService = new ExcelGeneratorServices();
    this.imageGeneratorService = new ImageGeneratorService();
  }

  /**
   * Genera PDFs de contratos desde un archivo Excel validado
   */
  readDataFromExcel = catchError(async (req: Request, res: Response) => {
    // Verificar que llegó el archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo Excel.',
      });
    }
    const response = await this.generateExcelService.processingExcel(
      req.file.buffer,
      req.file.originalname,
    );

    return res.status(CREATED).json({
      success: true,
      message: `Se importaron ${response.employees.length} empleados correctamente.`,
      data: response,
    });
  });
  generateExcelLawLife = catchError(async (req: Request, res: Response) => {
    const employee = req.body;
    const response =
      await this.generateExcelService.generateExcelLawLife(employee);
    const filename = 'VIDA_LEY_TRAMA_INV_URB_OP.xlsx';

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', response.length);

    res.end(response);
  });
  generateExcelSCTR = catchError(async (req: Request, res: Response) => {
    const employees = req.body;
    const response =
      await this.generateExcelService.generateExcelSCTR(employees);
    const filename = 'FORMATO_SCTR.xlsx';
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', response.length);
    res.end(response);
  });
  generateExcelCardID = catchError(async (req: Request, res: Response) => {
    const employee = req.body;
    const response =
      await this.generateExcelService.generateExcelCardID(employee);
    const filename = 'Fotocheck.csv';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', response.length);
    res.end(response);
  });
  excelToImage = catchError(async (req: Request, res: Response) => {
    const employees = req.body;
    const response = await this.imageGeneratorService.excelToImage(employees);
    const filename = 'excel.png';
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', response.length);
    res.end(response);
  });
}
