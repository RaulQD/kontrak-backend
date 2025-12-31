import { HttpStatusCode } from '../constants/http';
import { AppErrorContext } from '../types/employees.interface';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly data: AppErrorContext | undefined;
  constructor(
    message: string,
    statusCode: HttpStatusCode,
    data?: AppErrorContext,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
