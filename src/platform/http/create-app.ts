import express, { Express } from 'express';
import { CorsOptions } from 'cors';
import { Router } from 'express';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { healthRouter } from './health.route';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { errorMiddleware } from './middlewares/error-handler.middleware';

export interface AppRoute {
  path: string;
  router: Router;
}
export interface CreateAppOptions {
  routes: AppRoute[];
  corsOptions: CorsOptions;
  checkDatabase: () => Promise<unknown>;
}
export const createApp = ({
  routes,
  corsOptions,
  checkDatabase,
}: CreateAppOptions): Express => {
  const app = express();
  app.use(requestIdMiddleware);
  app.use(morgan('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use('/api', healthRouter(checkDatabase));
  for (const { path, router } of routes) app.use(path, router);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};
