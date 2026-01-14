import { ValidationResult } from './validation-result.interface';

/**
 * Metadata de un archivo para validación
 * Define la información mínima necesaria para validar
 */
export interface FileMetadataForValidation {
  /** Nombre del archivo con extensión */
  name: string;

  /** Tamaño en bytes (opcional, algunos validadores lo requieren) */
  size?: number;

  /** Tipo MIME del archivo (opcional) */
  mimeType?: string;

  /** Fecha de última modificación (opcional) */
  lastModified?: Date;
}

/**
 * Contrato que deben cumplir todos los validadores de archivos
 * Implementa el patrón Strategy para validaciones intercambiables
 */
export interface FileValidator {
  /**
   * Nombre identificador del validador
   */
  readonly name: string;

  /**
   * Valida un archivo y retorna el resultado
   * @param file Metadata del archivo a validar
   * @returns Resultado de la validación
   */
  validate(file: FileMetadataForValidation): ValidationResult;
}

/**
 * Validador que puede combinar múltiples validadores
 * Útil para ejecutar varias validaciones en secuencia
 */
export interface CompositeFileValidator extends FileValidator {
  /**
   * Agrega un validador a la cadena
   */
  addValidator(validator: FileValidator): void;

  /**
   * Obtiene todos los validadores registrados
   */
  getValidators(): FileValidator[];
}
