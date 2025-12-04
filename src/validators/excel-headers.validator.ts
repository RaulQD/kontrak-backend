import ExcelJS from 'exceljs';
import { AppError } from '../utils/app-error';
import { BAD_REQUEST } from '../constants/http';
import { AppErrorCode } from '../constants/app-error-code';
import { logger } from '../validators/logger';
import { HeaderValidationResult } from '../types/excel-types/excel.types';
import { ALL_FIELDS_MAP, BASE_FIELDS } from '../constants/contract-field';

/**
 * Normaliza un encabezado para comparación (minúsculas, sin espacios, sin acentos)
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '') // Eliminar espacios
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
}

/**
 * Encuentra el campo correspondiente a un encabezado del Excel
 */
function findFieldForHeader(excelHeader: string): string | null {
  const normalized = normalizeHeader(excelHeader);
  // Recorrer TODOS los campos posibles
  for (const [field, config] of Object.entries(ALL_FIELDS_MAP)) {
    // Verificar si algún alias coincide
    const commonAlias = config.aliases.some(
      (alias) => normalizeHeader(alias) === normalized,
    );
    if (commonAlias) {
      return field;
    }
  }

  return null;
}

/**
 * Valida que el Excel tenga todos los encabezados requeridos
 * @param worksheet - Hoja de cálculo de ExcelJS
 * @param headerRow - Número de fila donde están los encabezados (por defecto 1)
 * @returns Resultado de la validación con mapeo de encabezados
 */

/**
 * The function `validateExcelHeaders` in TypeScript validates and maps Excel headers, checking for
 * required fields and returning the validation result.
 * @param worksheet - The `worksheet` parameter is an ExcelJS.Worksheet object representing the
 * worksheet from which you want to validate the headers. It contains the data from the Excel file that
 * you want to process.
 * @param {number} [headerRow=1] - The `headerRow` parameter in the `validateExcelHeaders` function is
 * used to specify the row number in the Excel worksheet where the headers are located. By default, it
 * is set to 1, meaning that the headers are expected to be in the first row of the worksheet. However,
 * you
 * @returns The function `validateExcelHeaders` returns an object of type `HeaderValidationResult`,
 * which contains the following properties:
 * - `isValid`: a boolean indicating whether all required headers were found
 * - `missingHeaders`: an array of strings representing the names of missing required headers
 * - `headerMapping`: a Map object mapping field names to corresponding Excel headers
 * - `foundHeaders`: an array of strings representing
 */
export function validateExcelHeaders(
  worksheet: ExcelJS.Worksheet,
  headerRow: number = 1,
): HeaderValidationResult {
  const headers: string[] = [];
  const headerRowObj = worksheet.getRow(headerRow);

  // Extraer encabezados de la fila
  headerRowObj.eachCell((cell, colNumber) => {
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

    headers[colNumber - 1] = headerValue;
  });
  // Filtrar encabezados vacíos
  const validHeader = headers.filter((h) => h.length > 0);
  if (validHeader.length === 0) {
    throw new AppError(
      'No se encontraton encabezados validos en el archivo.',
      BAD_REQUEST,
      AppErrorCode.VALIDATION_ERROR,
    );
  }
  // Crear mapeo de campos a encabezados encontrados
  const headerMapping = new Map<string, string>();
  const foundFields = new Set<string>();

  validHeader.forEach((excelHeader) => {
    const field = findFieldForHeader(excelHeader);
    if (field) {
      headerMapping.set(field, excelHeader);
      foundFields.add(field);
    }
  });
  // Verificar qué campos requeridos faltan
  const requiredField = Object.entries(BASE_FIELDS);
  const missingHeaders: string[] = [];
  requiredField.forEach(([field, config]) => {
    if (!foundFields.has(field)) {
      // Obtener el nombre más común del campo para el mensaje de error
      const commonName = config.aliases[0];
      missingHeaders.push(commonName);
    }
  });
  const isValid = missingHeaders.length === 0;
  logger.info({
    totalHeaders: validHeader.length,
    foudnField: Array.from(foundFields),
    missingHeaders,
  });
  return { isValid, missingHeaders, headerMapping, foundHeaders: validHeader };
}

/**
 * Valida y lanza error si faltan encabezados requeridos
 * @param worksheet - Hoja de cálculo de ExcelJS
 * @param headerRow - Número de fila donde están los encabezados (por defecto 1)
 * @returns Mapeo de campos a encabezados encontrados
 * @throws AppError si faltan encabezados requeridos
 */
export function validateAndGetHeaderMapping(
  worksheet: ExcelJS.Worksheet,
  headerRow: number = 1,
): Map<string, string> {
  const result = validateExcelHeaders(worksheet, headerRow);
  if (!result.isValid) {
    const missingList = result.missingHeaders.map((h) => `${h}`).join(', ');
    throw new AppError(
      `Faltan encabezados requeridos en el archivo Excel: ${missingList}. Por favor, verifica que el archivo contenga todas las columnas necesarias.`,
      BAD_REQUEST,
      AppErrorCode.VALIDATION_ERROR,
    );
  }
  logger.info(
    `✅ Excel válido. ${result.headerMapping.size} campos reconocidos`,
  );
  return result.headerMapping;
}

/**
 * Obtiene los nombres sugeridos de encabezados para una plantilla Excel
 * @returns Array con los nombres sugeridos de encabezados
 */
export function getSuggestedHeaders(): string[] {
  return [
    'Nombre',
    'Apellido Paterno',
    'Apellido Materno',
    'DNI',
    'Provincia',
    'Distrito',
    'Departamento',
    'Dirección',
    'Salario',
    'Salario en Letras',
    'Fecha de Ingreso',
    'Tipo de Contrato',
  ];
}
