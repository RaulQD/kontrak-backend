import { Express } from 'express';
import { createApp } from './platform/http/create-app';
import { prisma } from './platform/database/prisma';
import { corsConfig } from './config/cors.config';
import legacyRouter from './api/routes';
import { authRouter, userSessionsRouter } from './modules/auth';
import { employeesRouter } from './modules/employees';

export const buildApp = (): Express =>
  createApp({
    corsOptions: corsConfig,
    checkDatabase: () => prisma.$queryRaw`SELECT 1`,
    routes: [
      { path: '/api', router: legacyRouter },
      { path: '/api/auth', router: authRouter },
      { path: '/api/users', router: userSessionsRouter },
      { path: '/api/employees', router: employeesRouter },
    ],
  });
