import { AppError } from '../../../shared/utils/app-error-v2';
import { AppError as LegacyAppError } from '../../../shared/utils/app-error';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../../shared/constants/http';
import { logger } from '../../../shared/utils/logger';
import { getRequestId } from '../request-context';

const GENERIC_SERVER_ERROR = 'Internal Server Error';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const logContext = {
    err,
    method: req.method,
    url: req.originalUrl,
    requestId: getRequestId(),
  };

  // La respuesta ya empezó (p. ej. un pipe() de PDF o ZIP que falla a mitad):
  // no se puede cambiar el estado; se registra y Express cierra la conexión.
  if (res.headersSent) {
    logger.error(logContext, 'Error después de iniciar la respuesta');
    next(err);
    return;
  }

  // Las rutas de descarga fijan cabeceras de archivo antes de fallar: si se
  // quedan, el navegador guarda el JSON de error como si fuera el archivo.
  res.removeHeader('Content-Disposition');
  res.removeHeader('Content-Type');

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

  // Errores del sistema legacy. Se elimina con TASK-13.
  if (err instanceof LegacyAppError) {
    // Un 5xx legacy es un fallo interno: el detalle va al log, no al cliente.
    if (err.statusCode >= INTERNAL_SERVER_ERROR) {
      logger.error(logContext, 'Error legacy del servidor');
      res
        .status(err.statusCode)
        .json({ success: false, message: GENERIC_SERVER_ERROR });
      return;
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.data && { data: err.data }),
    });
    return;
  }

  // Errores HTTP de librerías: body-parser (400 JSON mal formado, 413 cuerpo
  // muy grande) y CORS (403). Traen su estado en err.status; si la librería
  // marcó el mensaje como interno (expose: false), no se envía al cliente.
  const { status, expose } = err as { status?: unknown; expose?: unknown };
  if (
    typeof status === 'number' &&
    Number.isInteger(status) &&
    status >= 400 &&
    status < 500
  ) {
    logger.warn(logContext, 'Error HTTP de cliente');
    res.status(status).json({
      success: false,
      message: expose === false ? 'Solicitud inválida' : err.message,
    });
    return;
  }

  logger.error(logContext, 'Error no controlado');
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: GENERIC_SERVER_ERROR,
  });
};
