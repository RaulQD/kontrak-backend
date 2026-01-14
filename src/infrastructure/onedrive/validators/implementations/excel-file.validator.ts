import { ALLOWED_EXTENSIONS } from '../../../../shared/constants/excel';
import { logger } from '../../../../shared/utils/logger';
import {
  FileValidator,
  FileMetadataForValidation,
} from '../interfaces/file-validator.interface';
import {
  ValidationError,
  ValidationResult,
  ValidationResultFactory,
} from '../interfaces/validation-result.interface';

/**
 * Configuración para el validador de Excel
 */
export interface ExcelValidatorConfig {
  /** Tamaño máximo permitido en bytes (default: 10MB) */
  maxSizeBytes?: number;

  /** Extensiones permitidas (default: .xlsx, .xls, .csv) */
  allowedExtensions?: string[];

  /** Si debe rechazar archivos temporales ~$ (default: true) */
  rejectTempFiles?: boolean;
}

const DEFAULT_CONFIG: Required<ExcelValidatorConfig> = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedExtensions: ALLOWED_EXTENSIONS, // Reutiliza las constantes
  rejectTempFiles: true,
};

/**
 * Validador de archivos Excel
 * Implementa FileValidator para validar archivos antes de procesarlos
 *
 * Validaciones:
 * 1. Extensión del archivo (.xlsx, .xls)
 * 2. Tamaño máximo (configurable, default 10MB)
 * 3. No es archivo temporal (~$)
 */
export class ExcelFileValidator implements FileValidator {
  public readonly name = 'ExcelFileValidator';
  private readonly config: Required<ExcelValidatorConfig>;

  constructor(config?: ExcelValidatorConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Valida un archivo Excel
   * @param file Metadata del archivo
   * @returns ValidationResult con errores si los hay
   */
  public validate(file: FileMetadataForValidation): ValidationResult {
    const errors: ValidationError[] = [];

    // Validación 1: Extensión del archivo
    if (!this.isValidExtension(file.name)) {
      const fileExtension = file.name
        .slice(file.name.lastIndexOf('.'))
        .toLowerCase();
      errors.push(
        ValidationResultFactory.error(
          'INVALID_EXTENSION',
          `Tipo de archivo no permitido ${fileExtension}. Solo se permiten archivos Excel (${this.config.allowedExtensions.join(', ')})`,
          'extension',
        ),
      );
      logger.warn(`⏭️ Archivo ignorado (no es Excel): ${file.name}`);
    }

    // Validación 2: Archivo temporal
    if (this.config.rejectTempFiles && this.isTempFile(file.name)) {
      errors.push(
        ValidationResultFactory.error(
          'TEMP_FILE',
          `El archivo "${file.name}" es un archivo temporal de Excel y no puede ser procesado`,
          'name',
        ),
      );
      logger.warn(`Archivo temporal ignorado: ${file.name}`);
    }

    // Validación 3: Tamaño del archivo
    if (file.size !== undefined && this.isFileTooLarge(file.size)) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxMB = (this.config.maxSizeBytes / (1024 * 1024)).toFixed(0);
      errors.push(
        ValidationResultFactory.error(
          'FILE_TOO_LARGE',
          `El archivo "${file.name}" excede el tamaño máximo permitido (${sizeMB}MB, máx: ${maxMB}MB)`,
          'size',
        ),
      );
      logger.warn(
        `Archivo demasiado grande: ${file.name} (${sizeMB}MB, máx: ${maxMB}MB)`,
      );
    }

    // Retornar resultado
    if (errors.length > 0) {
      return ValidationResultFactory.failure(errors, file.name);
    }

    return ValidationResultFactory.success(file.name);
  }

  /**
   * Verifica si el archivo tiene una extensión válida de Excel
   */
  private isValidExtension(fileName: string): boolean {
    const lowerName = fileName.toLowerCase();
    return this.config.allowedExtensions.some((ext) =>
      lowerName.endsWith(ext.toLowerCase()),
    );
  }

  /**
   * Verifica si es un archivo temporal de Excel (~$)
   */
  private isTempFile(fileName: string): boolean {
    return fileName.startsWith('~$');
  }

  /**
   * Verifica si el archivo excede el tamaño máximo
   */
  private isFileTooLarge(size: number): boolean {
    return size > this.config.maxSizeBytes;
  }
}
