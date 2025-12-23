import { EmployeeData } from '../types/employees.interface';
import ExcelJS from 'exceljs';
import { logger } from '../utils/logger';
import { formatCurrency } from '../utils/formatCurrency';
import { toExcelSerialDate } from '../utils/date-to-serial-number';
import { changeStringToDate } from '../helpers';
import { MAP_SEX } from '../constants/excel';

export class ExcelGeneratorServices {
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
      { header: 'Sueldo', key: 'salary', width: 30 },
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
      const birthDateSerial = emp.birthDate
        ? toExcelSerialDate(
            typeof emp.birthDate === 'string'
              ? changeStringToDate(emp.birthDate)
              : emp.birthDate,
          )
        : null;
      const entryDateSerial = emp.entryDate
        ? toExcelSerialDate(
            typeof emp.entryDate === 'string'
              ? changeStringToDate(emp.entryDate)
              : emp.entryDate,
          )
        : null;
      const sexFormatted = MAP_SEX[emp.sex || ''] || emp.sex;
      worksheet.addRow({
        item,
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        name: emp.name,
        sex: sexFormatted,
        birthDate: birthDateSerial,
        typeDoc,
        dni: emp.dni,
        conditions,
        position: emp.position,
        salary: formatCurrency(Number(emp.salary)),
        coinsSalary,
        levelRisk: '',
        entryDate: entryDateSerial,
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
      { header: 'Sueldo', key: 'salary', width: 20 },
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
      const birthDateSerial = emp.birthDate
        ? toExcelSerialDate(
            typeof emp.birthDate === 'string'
              ? changeStringToDate(emp.birthDate)
              : emp.birthDate,
          )
        : null;
      const entryDateSerial = emp.entryDate
        ? toExcelSerialDate(
            typeof emp.entryDate === 'string'
              ? changeStringToDate(emp.entryDate)
              : emp.entryDate,
          )
        : null;
      const endDateSerial = emp.endDate
        ? toExcelSerialDate(
            typeof emp.endDate === 'string'
              ? changeStringToDate(emp.endDate)
              : emp.endDate,
          )
        : null;
      worksheet.addRow({
        item,
        lastNameFather: emp.lastNameFather,
        lastNameMother: emp.lastNameMother,
        name: emp.name,
        sex: emp.sex,
        birthDate: birthDateSerial,
        nationality,
        typeDoc,
        dni: emp.dni,
        DC: '',
        conditions,
        position: emp.position,
        currencySalary,
        salary: formatCurrency(Number(emp.salary)),
        rate,
        entryDate: entryDateSerial,
        endDate: endDateSerial,
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
    const buffer = await workbook.csv.writeBuffer();
    return buffer as unknown as Buffer;
  }
}
