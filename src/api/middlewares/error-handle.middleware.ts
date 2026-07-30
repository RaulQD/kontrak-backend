import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../shared/utils/app-error-v2';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../shared/constants/http';
import { logger } from '../../shared/utils/logger';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(BAD_REQUEST).json({
      success: false,
      message: 'La solicitud no se pudo procesar',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // AppError — domain/application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.data && { data: err.data }),
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }
  // Modelo viejo (v1): rama de transición, se elimina cuando migres los 12 archivos legacy
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }
  logger.error(
    { err: err, method: req.method, url: req.originalUrl },
    'Error no controlado',
  );
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
};
