import { Request, Response } from 'express';
import { CREATED } from '../../shared/constants/http';
import { AddendumServices } from '../../domain/excel/services/addendum.service';
import { catchError } from '../../shared/utils/catch-error';

export class AddendumController {
  private readonly addendumService: AddendumServices;
  constructor() {
    this.addendumService = new AddendumServices();
  }

  processExcelToAddendumData = catchError(
    async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se recibió ningún archivo. Envía un campo "excel"',
        });
      }
      const buffer = req.file.buffer;
      const response =
        await this.addendumService.processExcelToAddendumData(buffer);
      return res.status(CREATED).json({
        success: true,
        data: response,
      });
    },
  );
}
