import { Request, Response } from 'express';
import { catchError } from '../utils/catch-error';
import { CREATED } from '../constants/http';
import { AddendumServices } from '../services/addendum.service';

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
