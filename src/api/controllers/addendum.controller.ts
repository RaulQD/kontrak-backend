import { Request, Response } from 'express';
import { CREATED } from '../../shared/constants/http';
import { AddendumServices } from '../../domain/excel/services/addendum.service';
import { catchError } from '../../shared/utils/catch-error';
import { ContractService } from '../../domain/contracts/services/contract.service';

export class AddendumController {
  private readonly addendumService: AddendumServices;
  private readonly contractService: ContractService;
  constructor() {
    this.addendumService = new AddendumServices();
    this.contractService = new ContractService();
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
  generateAndDownloadZip = catchError(async (req: Request, res: Response) => {
    // Asumimos que el front-end envía la lista de adendas validadas en el body
    const employees = req.body;

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'Se requiere un arreglo de datos (employees) para generar los documentos.',
      });
    }

    // Configuramos los headers para indicar que la respuesta es un archivo descargable (ZIP)
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="adendas.zip"');

    // Delegamos la generación del stream al servicio
    await this.contractService.downloadAddendumsZipStream(res, employees);
  });
}
