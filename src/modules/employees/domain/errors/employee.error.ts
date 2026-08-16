import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../../../shared/utils/app-error-v2';

export class EmployeeNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Colaborador', id);
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
