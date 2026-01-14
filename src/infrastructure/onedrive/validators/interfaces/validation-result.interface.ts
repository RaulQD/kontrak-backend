/**
 * Resultado de una validación de archivo
 * Estandariza la respuesta de todos los validadores
 */
export interface ValidationResult {
  /** Indica si el archivo pasó todas las validaciones */
  isValid: boolean;

  /** Lista de errores encontrados (vacía si isValid es true) */
  errors: ValidationError[];

  /** Metadata adicional del proceso de validación */
  metadata?: {
    fileName?: string | undefined;
    validatedAt?: Date | undefined;
    validatorUsed?: string | undefined;
  };
}

/**
 * Representa un error específico de validación
 */
export interface ValidationError {
  /** Código único del error para identificación programática */
  code: string;

  /** Mensaje descriptivo del error */
  message: string;

  /** Campo o aspecto que falló la validación */
  field?: string | undefined;
}

/**
 * Factory para crear resultados de validación
 */
export const ValidationResultFactory = {
  /**
   * Crea un resultado exitoso
   */
  success(fileName?: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
    };

    if (fileName !== undefined) {
      result.metadata = {
        fileName,
        validatedAt: new Date(),
      };
    }

    return result;
  },

  /**
   * Crea un resultado fallido con errores
   */
  failure(errors: ValidationError[], fileName?: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors,
    };

    if (fileName !== undefined) {
      result.metadata = {
        fileName,
        validatedAt: new Date(),
      };
    }

    return result;
  },

  /**
   * Crea un error de validación
   */
  error(code: string, message: string, field?: string): ValidationError {
    const error: ValidationError = { code, message };
    if (field !== undefined) {
      error.field = field;
    }
    return error;
  },
};
