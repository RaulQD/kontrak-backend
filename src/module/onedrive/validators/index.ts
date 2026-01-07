export {
  FileValidator,
  CompositeFileValidator,
  FileMetadataForValidation,
} from './interfaces/file-validator.interface';

export {
  ValidationResult,
  ValidationError,
  ValidationResultFactory,
} from './interfaces/validation-result.interface';

export {
  ExcelFileValidator,
  ExcelValidatorConfig,
} from './implementations/excel-file.validator';
export { CompositeValidator } from './implementations/composite.validator';
export { isFileTooLarge } from './implementations/size.validator';
