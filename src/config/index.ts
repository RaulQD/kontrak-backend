import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ quiet: true });

/**
 * Configuración centralizada de la aplicación
 */
export const config = {
  // Configuración del servidor
  server: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },

  // Configuración de CORS
  cors: {
    origins: process.env.CORS_ORIGINS || ['http://localhost:5173'],
  },

  // Límites de archivos
  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB por defecto
    maxEmployees: parseInt(process.env.MAX_EMPLOYEES || '1000', 10),
  },

  // Directorios
  paths: {
    temp: path.resolve(process.env.TEMP_DIR || './temp'),
    templates: path.resolve('./src/templates'),
  },
};

/**
 * Validar que las configuraciones requeridas estén presentes
 */
export const validateConfig = (): void => {
  const isDevelopment = config.server.env === 'development';

  if (!isDevelopment && !process.env.PORT) {
    console.warn('WARNING: PORT no está configurado en producción');
  }

  console.info('Configuración cargada:', {
    env: config.server.env,
    port: config.server.port,
    host: config.server.host,
  });
};
