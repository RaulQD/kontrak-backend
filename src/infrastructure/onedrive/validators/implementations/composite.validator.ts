import {
  FileValidator,
  CompositeFileValidator,
  FileMetadataForValidation,
} from '../interfaces/file-validator.interface';
import {
  ValidationResult,
  ValidationResultFactory,
  ValidationError,
} from '../interfaces/validation-result.interface';

/**
 * Validador compuesto que ejecuta múltiples validadores en secuencia
 * Implementa el patrón Composite para combinar validadores
 *
 * @example
 * const validator = new CompositeValidator();
 * validator.addValidator(new ExcelFileValidator());
 * validator.addValidator(new CustomValidator());
 * const result = validator.validate(file);
 */
export class CompositeValidator implements CompositeFileValidator {
  public readonly name = 'CompositeValidator';
  private validators: FileValidator[] = [];

  constructor(validators?: FileValidator[]) {
    if (validators) {
      this.validators = validators;
    }
  }

  /**
   * Agrega un validador a la cadena
   */
  public addValidator(validator: FileValidator): void {
    this.validators.push(validator);
  }

  /**
   * Obtiene todos los validadores registrados
   */
  public getValidators(): FileValidator[] {
    return [...this.validators];
  }

  /**
   * Ejecuta todos los validadores en secuencia
   * Acumula todos los errores de cada validador
   * @param file Metadata del archivo a validar
   * @returns ValidationResult con errores combinados
   */
  public validate(file: FileMetadataForValidation): ValidationResult {
    const allErrors: ValidationError[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(file);
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    }

    if (allErrors.length > 0) {
      return ValidationResultFactory.failure(allErrors, file.name);
    }

    return {
      isValid: true,
      errors: [],
      metadata: {
        fileName: file.name,
        validatedAt: new Date(),
        validatorUsed: this.validators.map((v) => v.name).join(', '),
      },
    };
  }
}
