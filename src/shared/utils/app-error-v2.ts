import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from '../constants/http';

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  public errors?: Record<string, string[]>;
  public readonly data: Record<string, unknown> | undefined;

  constructor(message: string, data?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TooManyRequestsError extends AppError {
  readonly statusCode = TOO_MANY_REQUESTS;
  readonly code = 'TOO_MANY_REQUESTS';

  constructor(message = 'Demasiados intentos', data?: Record<string, unknown>) {
    super(message, data);
  }
}
export class BadRequestError extends AppError {
  readonly statusCode = BAD_REQUEST; // o 400
  readonly code = 'BAD_REQUEST';

  constructor(message: string) {
    super(message);
  }
}
export class NotFoundError extends AppError {
  readonly statusCode = NOT_FOUND;
  readonly code = 'NOT_FOUND';

  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
    );
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = UNAUTHORIZED;
  readonly code = 'UNAUTHORIZED';

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = FORBIDDEN;
  readonly code = 'FORBIDDEN';

  constructor(message = 'Access denied') {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = CONFLICT;
  readonly code = 'CONFLICT';

  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends AppError {
  readonly statusCode = UNPROCESSABLE_CONTENT;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    if (errors) {
      // Usamos Object.assign o una asignación directa (requiere quitar el readonly de errors en la clase abstracta o hacerlo de esta forma)
      Object.defineProperty(this, 'errors', {
        value: errors,
        enumerable: true,
      });
    }
  }
}

export class InternalError extends AppError {
  readonly statusCode = INTERNAL_SERVER_ERROR;
  readonly code = 'INTERNAL_ERROR';

  constructor(message = 'Internal server error') {
    super(message);
  }
}
