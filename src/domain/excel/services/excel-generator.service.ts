import ExcelJS from 'exceljs';
import { changeStringToDate } from '../../../shared/helpers';
import { MAP_SEX } from '../../../shared/constants/excel';
import {
  ADDENDUM_FIELDS_MAP,
  CONTRACT_FIELDS_MAP,
} from '../constants/contract-field';
import { ExcelParserServices } from './excel-parser.service';
import { excelProcessingResult } from '../../../shared/types/contract.interface';
import { toExcelSerialDate } from '../../../shared/utils/date-to-serial-number';
import { EmployeeData } from '../../../shared/types/employees.interface';
import { logger } from '../../../shared/utils/logger';
import { getRiskLevelByPosition } from '../helpers/risk-level.helper';
import { PassThrough, Readable } from 'stream';
import { AppError } from '../../../shared/utils/app-error';
export class ExcelGeneratorServices {
  private readonly excelParseServices: ExcelParserServices;
  constructor() {
    this.excelParseServices = new ExcelParserServices();
  }
  async processingExcel(
    source: Buffer | Readable,
    filename: string,
  ): Promise<excelProcessingResult> {
    logger.info(`Iniciando procesamiento de Excel desde OneDrive: ${filename}`);
    const validationResult = await this.excelParseServices.validateExcel(
      source,
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
  async processAddendumExcel(source: Buffer | Readable) {
    const validationResult =
      await this.excelParseServices.validateAddendumExcel(
        source,
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
  async generateExcelLawLife(employees: EmployeeData[]): Promise<Readable> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Generación de excel Vida Ley';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('hoja1');
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 10 },
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
      { header: 'Sueldo', key: 'salary', width: 30, style: { numFmt: '0.00' } },
      { header: 'Tasa/Nivel Riesgo', key: 'LevelRisk', width: 20 },
      { header: 'Fec. Ingreso', key: 'entryDate', width: 30 },
    ];
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: '000000' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
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
        birthDate: emp.birthDate,
        typeDoc,
        dni: emp.dni,
        conditions,
        position: emp.position,
        salary: Number(emp.salary),
        coinsSalary,
        levelRisk: '',
        entryDate: emp.entryDate,
      });
    }
    const stream = new PassThrough();
    await workbook.xlsx.write(stream);
    stream.end();
    return stream;
  }
  async generateExcelSCTR(employees: EmployeeData[]): Promise<Readable> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'FORMATO_SCTR';
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('Formato');
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 10 },
      { header: 'Apellido Paterno', key: 'lastNameFather', width: 20 },
      { header: 'Apellido Materno', key: 'lastNameMother', width: 20 },
      { header: 'Nombres', key: 'name', width: 20 },
      { header: 'Sexo', key: 'sex', width: 15 },
      { header: 'Fecha Nac/', key: 'birthDate', width: 15 },
      { header: 'Nacionalidad', key: 'nationality', width: 20 },
      { header: 'Tipo Doc/', key: 'typeDoc', width: 15 },
      { header: 'Numero Doc/', key: 'dni', width: 20 },
      { header: 'DC', key: 'DC', width: 15 },
      { header: 'Condición', key: 'conditions', width: 15 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Moneda Sueldo', key: 'currencySalary', width: 20 },
      { header: 'Sueldo', key: 'salary', width: 20 },
      { header: 'Tasa', key: 'rate', width: 20 },
      { header: 'Fec/ Ingreso', key: 'entryDate', width: 20 },
      { header: 'Fec/ cese', key: 'endDate', width: 20 },
      { header: 'Cod/ Cliente Ext/', key: 'codClient', width: 20 },
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
      const currencySalary = '0';
      const nationality = '174';
      const rate = getRiskLevelByPosition(emp.position) ?? 'ALTO RIESGO';
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
    const stream = new PassThrough();
    await workbook.xlsx.write(stream);
    stream.end();
    return stream;
  }
  async generateExcelCardID(employees: EmployeeData[]): Promise<Readable> {
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
    logger.info(`Se agregaron ${employees.length} filas al excel Vida ley`);
    const buffer = await workbook.csv.writeBuffer({
      dateFormat: 'DD/MM/YYYY',
      dateUTC: false,
      formatterOptions: {
        delimiter: ';', // Punto y coma para Excel en español/Latam
        writeBOM: true,
      },
      encoding: 'utf8',
    });
    const stream = new PassThrough();
    await workbook.csv.write(stream);
    stream.end();
    return stream;
  }
  async generateExcelGroupLife(employee: EmployeeData[]): Promise<Readable> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SCTR APE';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('SCTR APE');
    worksheet.columns = [
      { header: 'TIPO_PRODUCTO', key: 'typeProduct', width: 30 },
      { header: 'SUCURSAL_EMPRESA', key: 'headquarters', width: 30 },
      { header: 'TIPO_DOCUMENTO', key: 'typeDoc', width: 20 },
      { header: 'NRO_DOCUMENTO', key: 'dni', width: 20 },
      { header: 'APELLIDO_PATERNO', key: 'lastNameFather', width: 20 },
      { header: 'APELLIDO_MATERNO', key: 'lastNameMother', width: 20 },
      { header: 'PRIMER_NOMBRE', key: 'firstName', width: 20 },
      { header: 'SEGUNDO_NOMRE', key: 'secondName', width: 20 },
      { header: 'FECHA_NACIMIENTO', key: 'birthDate', width: 30 },
      { header: 'SEXO', key: 'sex', width: 20 },
      { header: 'IMPORTE_SUELDO_BRUTO', key: 'salary', width: 30 },
      { header: 'FECHA_INGRESO_EMPRESA', key: 'entryDate', width: 30 },
    ];
    const rows = worksheet.getRow(1);
    rows.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
    rows.font = { bold: true, color: { argb: '000000' } };
    rows.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd1d5db' },
    };
    for (const emp of employee) {
      const nameComplete = emp.name.split(' ').filter((n) => n.trim() !== '');
      const firstName = nameComplete[0] || '';
      const secondName =
        nameComplete.length > 1 ? nameComplete.slice(1).join(' ') : '';
      const sexFormatted = MAP_SEX[emp.sex || ''] || emp.sex;
      worksheet.addRow({
        typeProduct: 'VG',
        headquarters: '',
        typeDoc: '01',
        dni: emp.dni,
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        firstName,
        secondName,
        birthDate: emp.birthDate,
        sex: sexFormatted,
        salary: Number(emp.salary),
        entryDate: emp.entryDate,
      });
    }
    const stream = new PassThrough();
    await workbook.xlsx.write(stream);
    stream.end();
    return stream;
  }
  async generateInsurancesFola(employee: EmployeeData[]): Promise<Readable> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'INSURANCES FOLA';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Hoja1');
    worksheet.columns = [
      { header: 'APELLIDO PATERNO', key: 'lastNameFather', width: 20 },
      { header: 'APELLIDO MATERNO', key: 'lastNameMother', width: 20 },
      { header: 'NOMBRE COMPLETO', key: 'name', width: 20 },
      { header: 'DNI', key: 'dni', width: 20 },
      { header: 'FECHA DE INGRESO', key: 'entryDate', width: 20 },
      { header: 'FECHA DE NACIMIENTO', key: 'birthDate', width: 20 },
      { header: 'DIRECCION', key: 'address', width: 20 },
      { header: 'M O F', key: 'sex', width: 20 },
      { header: 'TEL/CELL', key: 'phone', width: 20 },
    ];
    const rows = worksheet.getRow(1);
    rows.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
    rows.font = { bold: true, color: { argb: '000000' } };
    rows.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    };
    for (const emp of employee) {
      worksheet.addRow({
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        name: emp.name,
        dni: emp.dni,
        entryDate: emp.entryDate,
        birthDate: emp.birthDate,
        address: emp.address,
        sex: emp.sex,
        phone: emp.phone,
      });
    }
    const stream = new PassThrough();
    await workbook.xlsx.write(stream);
    stream.end();
    return stream;
  }
  private processDate(date: string | Date | undefined | null): number | null {
    if (!date) return null;

    const dateObj = typeof date === 'string' ? changeStringToDate(date) : date;

    return toExcelSerialDate(dateObj);
  }
  async detectExcelType(
    source: Buffer | Readable,
  ): Promise<'contracts' | 'addendum'> {
    const workbook = new ExcelJS.Workbook();
    let buffer: Buffer;
    if (source instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of source) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      buffer = Buffer.concat(chunks);
    } else {
      buffer = source;
    }
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet)
      throw new AppError('Excel vacío, no tiene información', 400);
    const header: string[] = [];
    worksheet.getRow(1).eachCell((cell) => {
      header.push(String(cell.value).toLowerCase().trim());
    });
    const addendumKeywords = ['INICIO ADENDA', 'FIN ADENDA'];
    const isAddendum = addendumKeywords.some((keyword) =>
      header.some((h) => h.includes(keyword.toLowerCase())),
    );
    logger.info(
      `Tipo de Excel detectado: ${isAddendum ? 'ADENDA' : 'CONTRATO'}`,
    );
    return isAddendum ? 'addendum' : 'contracts';
  }
}
