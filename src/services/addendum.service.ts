import { ADDENDUM_FIELDS_MAP } from '../constants/contract-field';
import { BAD_REQUEST } from '../constants/http';
import { AppError } from '../utils/app-error';
import { ExcelParserServices } from './excel-parser.service';

export class AddendumServices {
  private readonly excelParseServices: ExcelParserServices;
  constructor() {
    this.excelParseServices = new ExcelParserServices();
  }
  async processExcelToAddendumData(buffer: Buffer) {
    const validationResult =
      await this.excelParseServices.validateAddendumExcel(
        buffer,
        ADDENDUM_FIELDS_MAP,
        {
          sheetIndex: 0,
          skipEmptyRows: true,
          headerRow: 1,
        },
      );
    if (
      validationResult.totalRecords > 0 &&
      validationResult.validRecords === 0
    ) {
      const primerError = validationResult.errors[0];
      const mensajePista = primerError
        ? ` (Ej: Fila ${primerError.row}: ${primerError.error.message})`
        : '';

      throw new AppError(
        `El archivo contiene ${validationResult.totalRecords} registros, pero ninguno es válido. Por favor revisa el formato de las columnas.${mensajePista}`,
        BAD_REQUEST,
      );
    }
    return {
      totalRecords: validationResult.totalRecords,
      validRecords: validationResult.validRecords,
      invalidRecords: validationResult.errors.length,
      employees: validationResult.employeesAddendum,
      validationErrors: validationResult.errors,
    };
  }
}
