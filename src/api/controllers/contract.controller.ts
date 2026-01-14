import { Request, Response } from 'express';
import { ContractService } from '../../domain/contracts/services/contract.service';
import { catchError } from '../../shared/utils/catch-error';
import { PDFGeneratorService } from '../../domain/contracts/services/pdf-generator.service';
import puppeteer from 'puppeteer';
import { EmployeeData } from '../../shared/types/employees.interface';

export class ContractController {
  private readonly contractService: ContractService;
  private readonly pdfGeneratorService: PDFGeneratorService;
  constructor() {
    this.contractService = new ContractService();
    this.pdfGeneratorService = new PDFGeneratorService();
  }

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
    const employeeData: EmployeeData = req.body;
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const { buffer, filename } =
      await this.pdfGeneratorService.generateContract(
        employeeData,
        employeeData.contractType,
        browser,
      );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    return res.send(buffer);
  });
}
