import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handle.middleware';
import { corsConfig } from './config/cors.config';
import { logger } from './utils/logger';
import router from './routes';

export const createApp = async (): Promise<Express> => {
  const app = express();
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsConfig));

  // Health check - Endpoint raíz
  logger.info('Registrando ruta GET /');
  app.get('/', (req, res) => {
    logger.info({ path: req.path, method: req.method }, 'Ruta GET / alcanzada');
    res.json({
      success: true,
      message: 'Kontrak API - Sistema de Generación de Contratos',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        uploadExcel: 'POST /api/contracts/upload',
        health: 'GET /api/health',
      },
    });
  });
  logger.info('Ruta GET / registrada');

  // Rutas de la API (debe ir ANTES del errorHandler)
  logger.info('Registrando rutas en /api');
  app.use('/api', router);
  logger.info('Rutas registradas correctamente en /api');

  // Manejar rutas no encontradas (404) - debe ir ANTES del errorHandler
  app.use((req, res, _next) => {
    logger.warn({ path: req.path, method: req.method }, 'Ruta no encontrada');
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      path: req.path,
      method: req.method,
      availableEndpoints: {
        root: 'GET /',
        health: 'GET /api/health',
        uploadExcel: 'POST /api/contracts/upload',
      },
    });
  });
  app.use(errorHandler);

  return app;
};
