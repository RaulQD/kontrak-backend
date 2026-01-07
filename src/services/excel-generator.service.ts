import { EmployeeData } from '../types/employees.interface';
import ExcelJS from 'exceljs';
import { logger } from '../utils/logger';
import { formatCurrency } from '../utils/formatCurrency';
import { toExcelSerialDate } from '../utils/date-to-serial-number';
import { changeStringToDate } from '../helpers';
import { MAP_SEX } from '../constants/excel';
import {
  ADDENDUM_FIELDS_MAP,
  CONTRACT_FIELDS_MAP,
} from '../constants/contract-field';
import { excelProcessingResult } from '../types/contract.interface';
import { ExcelParserServices } from './excel-parser.service';
export class ExcelGeneratorServices {
  private readonly excelParseServices: ExcelParserServices;
  constructor() {
    this.excelParseServices = new ExcelParserServices();
  }
  async processingExcel(
    buffer: Buffer,
    filename: string,
  ): Promise<excelProcessingResult> {
    logger.info(
      `🔄 Iniciando procesamiento de Excel desde OneDrive: ${filename}`,
    );
    const validationResult = await this.excelParseServices.validateExcel(
      buffer,
      CONTRACT_FIELDS_MAP,
      {
        sheetIndex: 0,
        skipEmptyRows: true,
        headerRow: 1,
      },
    );

    return {
      totalRecords: validationResult.totalRecords,
      employees: validationResult.employees,
    };
  }
  async processAddendumExcel(buffer: Buffer) {
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
      validRecords: validationResult.validRecords,
      invalidRecords: validationResult.errors.length,
      employees: validationResult.employeesAddendum,
      validationErrors: validationResult.errors,
    };
  }
  async generateExcelLawLife(employees: EmployeeData[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Generación de excel Vida Ley';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('hoja1');
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 20 },
      { header: 'Apellido Paterno', key: 'lastNameFather', width: 30 },
      { header: 'Apellido Materno', key: 'lastNameMother', width: 30 },
      { header: 'Nombres', key: 'name', width: 30 },
      { header: 'Sexo', key: 'sex', width: 15 },
      { header: 'Fecha Nac.', key: 'birthDate', width: 30 },
      { header: 'Tipo Doc.', key: 'typeDoc', width: 20 },
      { header: 'Numero Doc.', key: 'dni', width: 30 },
      { header: 'Condición', key: 'conditions', width: 15 },
      { header: 'Cargo', key: 'position', width: 30 },
      { header: 'Monedas Sueldo', key: 'coinsSalary', width: 20 },
      {
        header: 'Sueldo',
        key: 'salary',
        width: 30,
        style: { numFmt: '"S/" #,##0.00' },
      },
      { header: 'Tasa/Nivel Riesgo', key: 'LevelRisk', width: 20 },
      { header: 'Fec. Ingreso', key: 'entryDate', width: 30 },
    ];
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: '000000' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'fef08a' },
    };
    for (const [i, emp] of employees.entries()) {
      const item = i + 1;
      const conditions = 'P';
      const typeDoc = 'DNI';
      const coinsSalary = 'SOLES';
      const sexFormatted = MAP_SEX[emp.sex || ''] || emp.sex;
      worksheet.addRow({
        item,
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        name: emp.name,
        sex: sexFormatted,
        birthDate: this.processDate(emp.birthDate),
        typeDoc,
        dni: emp.dni,
        conditions,
        position: emp.position,
        salary: Number(emp.salary),
        coinsSalary,
        levelRisk: '',
        entryDate: this.processDate(emp.entryDate),
      });
    }
    logger.info(`Se agregaron ${employees.length} filas  al excel Vida ley`);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }
  async generateExcelSCTR(employees: EmployeeData[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'FORMATO_SCTR';
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('hoja1');
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 10 },
      { header: 'Apellido Paterno', key: 'lastNameFather', width: 20 },
      { header: 'Apellido Materno', key: 'lastNameMother', width: 20 },
      { header: 'Nombres', key: 'name', width: 20 },
      { header: 'Sexo', key: 'sex', width: 15 },
      { header: 'Fecha Nac.', key: 'birthDate', width: 15 },
      { header: 'Nacionalidad', key: 'nationality', width: 20 },
      { header: 'Tipo Doc.', key: 'typeDoc', width: 15 },
      { header: 'Numero Doc.', key: 'dni', width: 20 },
      { header: 'DC', key: 'DC', width: 15 },
      { header: 'Condición', key: 'conditions', width: 15 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Moneda Sueldo', key: 'currencySalary', width: 20 },
      {
        header: 'Sueldo',
        key: 'salary',
        width: 20,
        style: { numFmt: '"S/" #,##0.00' },
      },
      { header: 'Tasa', key: 'rate', width: 20 },
      { header: 'Fecha Ingreso', key: 'entryDate', width: 20 },
      { header: 'Fecha cese', key: 'endDate', width: 20 },
      { header: 'Cod/Cliente', key: 'codClient', width: 20 },
      { header: 'Sede', key: 'headquarters', width: 20 },
    ];
    const rows = worksheet.getRow(1);
    rows.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
    for (const [i, emp] of employees.entries()) {
      const item = i + 1;
      const conditions = 'P';
      const typeDoc = 'DNI';
      const currencySalary = 'SOLES';
      const nationality = 'PERUANA';
      const rate = 'ALTO RIESGO';
      const headquarters = 'PLAYA';
      worksheet.addRow({
        item,
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        name: emp.name,
        sex: emp.sex,
        birthDate: this.processDate(emp.birthDate),
        nationality,
        typeDoc,
        dni: emp.dni,
        DC: '',
        conditions,
        position: emp.position,
        currencySalary,
        salary: Number(emp.salary),
        rate,
        entryDate: this.processDate(emp.entryDate),
        endDate: this.processDate(emp.endDate),
        codClient: '',
        headquarters,
      });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }
  async generateExcelCardID(employees: EmployeeData[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'FOTOCHECK EN CSV';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(`Fotochecks`);
    worksheet.columns = [
      { header: 'CARGO', key: 'position', width: 20 },
      { header: 'DIVISION', key: 'subDivisionOrParking', width: 20 },
      { header: 'DNI', key: 'dni', width: 20 },
      { header: 'APELLIDO', key: 'lastName', width: 30 },
      { header: 'NOMBRE', key: 'name', width: 20 },
    ];
    for (const emp of employees) {
      worksheet.addRow({
        position: emp.position,
        subDivisionOrParking: emp.subDivisionOrParking,
        dni: emp.dni,
        lastName: `${emp.lastNameFather} ${emp.lastNameMother}`,
        name: emp.name,
      });
    }
    logger.info(`Se agregaron ${employees.length} filas  al excel Vida ley`);
    const buffer = await workbook.csv.writeBuffer({
      dateFormat: 'DD/MM/YYYY',
      dateUTC: false,
      formatterOptions: {
        delimiter: ';', // Punto y coma para Excel en español/Latam
        writeBOM: true,
      },
      encoding: 'utf8',
    });
    return buffer as unknown as Buffer;
  }

  private processDate(date: string | Date | undefined | null): number | null {
    if (!date) return null;

    const dateObj = typeof date === 'string' ? changeStringToDate(date) : date;

    return toExcelSerialDate(dateObj);
  }
}
