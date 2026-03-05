import XlsxPopulate from 'xlsx-populate';
import { EmployeeData } from '../../../shared/types/employees.interface';
import { AppError } from '../../../shared/utils/app-error';
import { NOT_FOUND } from '../../../shared/constants/http';
import { logger } from '../../../shared/utils/logger';

export class SalaryAccountService {
  private readonly START_ROW = 33;
  private readonly SHEET_NAME = 'Plantilla';
  private readonly MAX_ROWS_TO_CLEAR = 200;
  constructor() {}
  async updateExcel(
    templateBuffer: Buffer,
    employees: EmployeeData[],
  ): Promise<Buffer> {
    logger.info(`Llenando plantilla BCP con ${employees.length} empleados`);
    const workbook = await XlsxPopulate.fromDataAsync(templateBuffer);
    const worksheet = workbook.sheet(this.SHEET_NAME);
    if (!worksheet) {
      logger.warn(`No se encontro la hoja ${this.SHEET_NAME}`);
      throw new AppError(
        `No se encontro la hoja ${this.SHEET_NAME}`,
        NOT_FOUND,
      );
    }
    logger.info(
      `[BCP] Limpiando datos anteriores desde fila ${this.START_ROW} hasta ${this.START_ROW + this.MAX_ROWS_TO_CLEAR}`,
    );
    for (
      let row = this.START_ROW;
      row < this.START_ROW + this.MAX_ROWS_TO_CLEAR;
      row++
    ) {
      worksheet.cell(`D${row}`).value('');
      worksheet.cell(`E${row}`).value('');
      worksheet.cell(`F${row}`).value('');
      worksheet.cell(`G${row}`).value('');
      worksheet.cell(`H${row}`).value('');
      worksheet.cell(`I${row}`).value('');
      worksheet.cell(`J${row}`).value('');
      worksheet.cell(`K${row}`).value('');
      worksheet.cell(`L${row}`).value('');
      worksheet.cell(`M${row}`).value('');
      worksheet.cell(`N${row}`).value('');
      worksheet.cell(`O${row}`).value('');
    }
    logger.info(
      '[BCP] Limpieza completada. Iniciando escritura de nuevos datos',
    );
    employees.forEach((emp, index) => {
      const row = this.START_ROW + index;
      // Log para debugear
      logger.info(
        `[BCP] Fila ${row}: DNI=${emp.dni}, Nombre=${emp.name}, ApPaterno=${emp.lastNameFather}`,
      );

      worksheet.cell(`D${row}`).value(emp.dni);
      worksheet.cell(`E${row}`).value('1');
      worksheet.cell(`F${row}`).value(emp.lastNameFather);
      worksheet.cell(`G${row}`).value(emp.lastNameMother);
      worksheet.cell(`H${row}`).value(emp.name);
      worksheet.cell(`I${row}`).value(emp.birthDate);
      worksheet.cell(`J${row}`).value(' ');
      worksheet.cell(`K${row}`).value(emp.sex);
      worksheet.cell(`L${row}`).value('PERU');
      worksheet.cell(`M${row}`).value(emp.phone);
      worksheet.cell(`N${row}`).value(emp.email.toLowerCase());
      worksheet.cell(`O${row}`).value(emp.department);
    });

    logger.info(
      `[BCP] Total filas escritas: ${employees.length}, desde fila ${this.START_ROW} hasta ${this.START_ROW + employees.length - 1}`,
    );

    const outputBuffer = await workbook.outputAsync();
    return outputBuffer as Buffer;
  }
}
