import { CorsOptions } from 'cors';
import { FORBIDDEN } from '../shared/constants/http';

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((url) => url.trim())
      : ['http://localhost:5173'];

    if (origin && !whiteList.includes(origin)) {
      console.info('🚫 CORS Bloqueado:', origin);
      console.info('✅ Permitidos:', whiteList);
    }

    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        Object.assign(new Error('Origen no permitido por CORS'), {
          status: FORBIDDEN,
        }),
      );
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // El refresh token viaja en una cookie httpOnly: sin esto el navegador
  // bloquea las peticiones con credentials: 'include' desde el frontend.
  credentials: true,
  exposedHeaders: ['X-Request-Id'],
};
