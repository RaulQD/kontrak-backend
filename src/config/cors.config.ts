import { CorsOptions } from 'cors';

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
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};
