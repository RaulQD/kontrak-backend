import { Request, Response } from 'express';
import { logger } from '../../../shared/utils/logger';
import { NOT_FOUND } from '../../../shared/constants/http';
import { getRequestId } from '../request-context';
export const notFoundMiddleware = (req: Request, res: Response): void => {
  logger.warn(
    { method: req.method, url: req.originalUrl, requestId: getRequestId() },
    'Ruta no encontrada',
  );
  res.status(NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
};
