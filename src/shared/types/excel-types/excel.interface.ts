/**
 * Interfaz para representar los datos extraídos de una fila del Excel
 */
export type ExcelRowData = {
  [key: string]: string | number | boolean | Date | null;
};

/**
 * Resultado de la validación de encabezados
 */
export interface HeaderValidationResult {
  isValid: boolean;
  missingHeaders: string[];
  headerMapping: Map<string, string>; // Mapea el nombre del campo al encabezado encontrado en Excel
  foundHeaders: string[];
}
