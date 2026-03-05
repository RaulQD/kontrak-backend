/**
 * Template para notificación de error crítico
 */
export interface ErrorTemplateData {
  userName: string;
  fileName: string;
  errorMessage: string;
}

/**
 * Template para notificación de errores de validación
 */
export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ValidationErrorTemplateData {
  createdByEmail: string;
  userName: string;
  fileName: string;
  errors: ValidationError[];
}

/**
 * Template para notificación de éxito
 */
export interface ContractStats {
  fullTime: number;
  partTime: number;
  subsidio: number;
  apeTratamientoDatos: number;
}

export interface SuccessTemplateData {
  userName: string;
  createdByEmail: string;
  fileName: string;
  totalEmployees: number;
  contracts: ContractStats;
}
