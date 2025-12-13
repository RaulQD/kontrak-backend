import ExcelJS from 'exceljs';
import { logger } from '../utils/logger';
import { BAD_REQUEST } from '../constants/http';
import { AppError } from '../utils/app-error';
import { validateAndGetHeaderMapping } from '../validators/excel-headers.validator';
import { ExcelRowData } from '../types/excel-types/excel.types';
import { ValidationService } from './validation.service';
import { ValidationResult } from '../types/employees.types';

/**
 * Opciones para importar Excel
 */
export interface ImportOptions {
  sheetIndex?: number; // Índice de la hoja (0, 1, 2...)
  sheetName?: string; // Nombre de la hoja
  skipEmptyRows?: boolean; // Saltar filas vacías
  skipEmptyCells?: boolean; // Saltar celdas vacías
  headerRow?: number; // Número de fila donde están los encabezados
}
/**
 * Información de una hoja de Excel
 */
export interface SheetInfo {
  name: string;
  index: number;
  rowCount: number;
  columnCount: number;
}

export class ExcelParserServices {
  private readonly validationService: ValidationService;
  constructor() {
    this.validationService = new ValidationService();
  }
  async validateExcel(
    buffer: Buffer,
    options: ImportOptions,
  ): Promise<ValidationResult> {
    logger.info(
      { bufferSize: buffer.length },
      '🚀 Iniciando procesamiento de Excel',
    );

    try {
      const rawData = await this.importExcelFromBuffer(buffer, options);

      if (!rawData || rawData.length === 0) {
        throw new AppError(
          'El archivo Excel no contiene datos válidos',
          BAD_REQUEST,
        );
      }

      const totalRecords = rawData.length;

      logger.info({ totalRecords }, '📄 Registros extraídos del Excel');

      const validation =
        this.validationService.validateEmployeeInbatch(rawData);

      const invalidRows = new Set(validation.errors.map((e) => e.row));
      const invalidRecords = invalidRows.size;
      const validRecords = validation.validEmployees?.length || 0;

      logger.info(
        {
          totalRecords,
          validRecords,
          invalidRecords,
          totalErrors: validation.errors.length,
        },
        validation.isValid ? 'Validación exitosa' : 'Validación con errores',
      );

      const result: ValidationResult = {
        isValid: validation.isValid,
        employees: validation.validEmployees || [],
        errors: validation.errors,
        totalRecords,
        validRecords,
        invalidRecords,
      };

      return result;
    } catch (error) {
      logger.error({ error }, '❌ Error al procesar Excel');
      throw error;
    }
  }

  async importExcelFromBuffer(
    buffer: Buffer,
    options: ImportOptions,
  ): Promise<ExcelRowData[]> {
    logger.info(
      { bufferSize: buffer.length },
      'Iniciando lectura de Excel desde buffer',
    );
    //Cargar el archivo excel mediante buffer
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
      if (workbook.worksheets.length === 0) {
        throw new AppError(
          'El archivo Excel está vacío o no contiene hojas',
          BAD_REQUEST,
        );
      }
      const worksheet = this.selectWorkSheet(workbook, options);

      // Validar encabezados antes de procesar
      const headerRow = options.headerRow ?? 1;
      const headerMapping = validateAndGetHeaderMapping(worksheet, headerRow);

      // Extraer datos usando el mapeo de encabezados
      const data = this.extractDataFromWorksheet(
        worksheet,
        options,
        headerMapping,
      );
      // const validation = this.validationService.validateEmployeeInbatch(data);

      return data;
    } catch (error) {
      logger.error({ error }, 'Error al leer Excel desde buffer');

      if (error instanceof AppError) {
        throw error;
      }

      if (
        (error as Error).message.includes('corrupt') ||
        (error as Error).message.includes('zip')
      ) {
        throw new AppError(
          'El archivo Excel está corrupto o no es un archivo válido',
          BAD_REQUEST,
        );
      }

      throw new AppError(
        'Error al procesar archivo Excel desde buffer',
        BAD_REQUEST,
      );
    }
  }
  private selectWorkSheet(
    workbook: ExcelJS.Workbook,
    options: ImportOptions,
  ): ExcelJS.Worksheet {
    let worksheet: ExcelJS.Worksheet | undefined;
    if (options.sheetName) {
      worksheet = workbook.getWorksheet(options.sheetName);
      if (!worksheet) {
        throw new AppError(
          `La hoja "${options.sheetName}" no existe en el archivo`,
          BAD_REQUEST,
        );
      }
    } else {
      const index = options.sheetIndex ?? 0;
      worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new AppError(
          `No se encontró la hoja en el índice ${index}`,
          BAD_REQUEST,
        );
      }
    }
    return worksheet;
  }
  private extractDataFromWorksheet(
    worksheet: ExcelJS.Worksheet,
    options: ImportOptions,
    headerMapping: Map<string, string>,
  ): ExcelRowData[] {
    const data: ExcelRowData[] = [];
    const headersRow = options.headerRow ?? 1;
    const skipEmptyRows = options.skipEmptyRows ?? true;

    // Crear mapeo inverso: encabezado Excel -> campo del modelo
    const excelHeaderToField = new Map<string, string>();
    headerMapping.forEach((excelHeader, field) => {
      excelHeaderToField.set(excelHeader.toLowerCase().trim(), field);
    });

    // Obtener todos los encabezados de la fila
    const excelHeaders: string[] = [];
    worksheet.getRow(headersRow).eachCell((cell, colNumber) => {
      const value = cell.value;
      let headerValue = '';

      if (value !== null && value !== undefined) {
        if (typeof value === 'string') {
          headerValue = value.trim();
        } else if (typeof value === 'object' && 'text' in value) {
          headerValue = String((value as { text: string }).text).trim();
        } else {
          headerValue = String(value).trim();
        }
      }

      excelHeaders[colNumber - 1] = headerValue;
    });

    // Procesar cada fila de datos
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headersRow) return; // Saltar fila de encabezados

      const fila: ExcelRowData = {};
      let hasData = false;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const excelHeader = excelHeaders[colNumber - 1];
        if (excelHeader) {
          const field = excelHeaderToField.get(
            excelHeader.toLowerCase().trim(),
          );
          if (field) {
            const value = this.extractCellValue(cell);
            let finalValue = value;

            if (field === 'dni' && typeof value === 'number') {
              // Convertir DNI de number a string
              finalValue = String(value);
            } else if (field === 'entryDate') {
              if (value instanceof Date) {
                const day = String(value.getDate() + 1).padStart(2, '0');
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const year = value.getFullYear();
                finalValue = `${day}/${month}/${year}`;
              }
            } else if (field === 'endDate') {
              if (value instanceof Date) {
                const day = String(value.getDate() + 1).padStart(2, '0');
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const year = value.getFullYear();
                finalValue = `${day}/${month}/${year}`;
              }
            } else if (field === 'salary') {
              if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed === '' || trimmed === 'N/A') {
                  finalValue = null;
                } else {
                  let cleanValue = trimmed.replace(/^S\/\.?\s*/i, '').trim();
                  cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');

                  const num = Number(cleanValue);
                  finalValue = isNaN(num) ? null : num;
                }
              }
            } else if (typeof value === 'string' && value.trim() === '') {
              finalValue = null;
            }

            if (finalValue !== null && finalValue !== undefined) {
              fila[field] = finalValue;
              hasData = true;
            }
          }
        }
      });
      if (hasData || !skipEmptyRows) {
        data.push(fila);
      }
    });

    return data;
  }

  private extractCellValue(
    cell: ExcelJS.Cell,
  ): string | number | boolean | Date | null {
    const value = cell.value;

    if (value === null || value === undefined) {
      return null;
    }
    // Preservar tipos primitivos
    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Date
    ) {
      return value;
    }
    // String
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }
    // Rich text - extraer solo el texto
    if (typeof value === 'object' && 'text' in value) {
      const text = String((value as { text: string }).text).trim();
      return text === '' ? null : text;
    }

    // Formula result - retornar el resultado
    if (typeof value === 'object' && 'result' in value) {
      const result = (value as { result: unknown }).result;
      if (typeof result === 'string') {
        const trimmed = result.trim();
        return trimmed === '' ? null : trimmed;
      }
      if (
        typeof result === 'number' ||
        typeof result === 'boolean' ||
        result instanceof Date
      ) {
        return result;
      }
      return String(result).trim() || null;
    }

    // Por defecto
    const stringValue = String(value).trim();
    return stringValue === '' ? null : stringValue;
  }
  private parseExcelDate(value: Date): string {
    if (value instanceof Date) {
      const day = String(value.getDate() + 1).padStart(2, '0');
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const year = value.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return value;
  }
}
