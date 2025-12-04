import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { logger } from '../validators/logger';
import { BAD_REQUEST } from '../constants/http';

export const ErrorHandleMulter = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    logger.warn({ error: error.message, code: error.code }, 'Error de Multer');
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'El archivo es demasiado grande. Tamaño máximo: 10 MB',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'Solo puedes subir 1 archivo a la vez',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Campo de archivo inesperado. Usa el campo "excel"',
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Error al subir archivo: ${error.message}`,
        });
    }
  }
  if (error.message) {
    logger.warn({ error: error.message }, 'Error de validación');

    // Errores de tipo de archivo
    if (
      error.message.includes('Tipo de archivo no permitido') ||
      error.message.includes('Extensión de archivo no permitida')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  next(error);
};
