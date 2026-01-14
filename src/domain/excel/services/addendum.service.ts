import { ADDENDUM_FIELDS_MAP } from '../constants/contract-field';
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

    return {
      totalRecords: validationResult.totalRecords,
      employees: validationResult.employeesAddendum,
    };
  }
}
