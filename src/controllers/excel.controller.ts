import { Request, Response } from 'express';
import { ExcelGeneratorServices } from '../services/excel-generator.service';
import { catchError } from '../utils/catch-error';

export class ExcelController {
  private readonly generateExcelService: ExcelGeneratorServices;
  constructor() {
    this.generateExcelService = new ExcelGeneratorServices();
  }
  generateExcelLawLife = catchError(async (req: Request, res: Response) => {
    const employee = req.body;
    const response =
      await this.generateExcelService.generateExcelLawLife(employee);
    const filename = 'VIDA_LEY_TRAMA_INV_URB_OP.xlsx';

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
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
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', response.length);
    res.end(response);
  });
  generateExcelCardID = catchError(async (req: Request, res: Response) => {
    const employee = req.body;
    const response =
      await this.generateExcelService.generateExcelCardID(employee);
    const filename = 'Fotocheck.csv';
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', response.length);
    res.end(response);
  });
}
