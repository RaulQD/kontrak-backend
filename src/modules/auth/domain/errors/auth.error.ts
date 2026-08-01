import {
  ForbiddenError,
  TooManyRequestsError,
  UnauthorizedError,
} from '../../../../shared/utils/app-error-v2';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Credenciales inválidas'); // mismo mensaje para email inexistente y password mala (no enumerar usuarios)
  }
}

export class AccountLockedError extends TooManyRequestsError {
  constructor(public readonly lockedUntil: Date) {
    const retryAfterSeconds = Math.max(
      0,
      Math.ceil((lockedUntil.getTime() - Date.now()) / 1000),
    );
    super('Cuenta bloqueada temporalmente por intentos fallidos', {
      retryAfterSeconds,
    });
  }
}

export class AccountInactiveError extends ForbiddenError {
  constructor() {
    super('La cuenta está desactivada');
  }
}

export class InvalidRefreshTokenError extends UnauthorizedError {
  constructor() {
    super('Sesión inválida. Inicia sesión nuevamente');
  }
}
