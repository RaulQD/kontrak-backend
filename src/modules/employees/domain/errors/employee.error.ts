import { NOT_FOUND } from '../../../../shared/constants/http';
import {
  AppError,
  ConflictError,
  ValidationError,
} from '../../../../shared/utils/app-error-v2';

// No hereda de NotFoundError: ese constructor arma el mensaje en inglés
// (`${resource} not found`) y lo añadiría como sufijo al texto en español.
export class EmployeeNotFoundError extends AppError {
  readonly statusCode = NOT_FOUND;
  readonly code = 'NOT_FOUND';

  constructor(id: string) {
    super(`No se encontró un colaborador con el id ${id}`);
  }
}

export class DuplicateDocumentError extends ConflictError {
  constructor(documentType: string, documentNumber: string) {
    super(`Ya existe un colaborador con ${documentType} ${documentNumber}`);
  }
}

export class DuplicateEmployeeCodeError extends ConflictError {
  constructor(employeeCode: string) {
    super(`Ya existe un colaborador con el código ${employeeCode}`);
  }
}

export class UbigeoNotFoundError extends ValidationError {
  constructor(ubigeoId: string) {
    super(`El ubigeo ${ubigeoId} no existe`);
  }
}

/** Invariante del dominio incumplida (formato de documento, fechas, etc.). */
export class InvalidEmployeeDataError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}

export class TerminationNotAllowedError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}
