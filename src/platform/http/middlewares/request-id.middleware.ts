import { randomUUID } from 'node:crypto';
import { RequestHandler } from 'express';
import { runWithRequestContext } from '../request-context';

export const requestIdMiddleware: RequestHandler = (_req, res, next) => {
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  runWithRequestContext({ requestId }, () => next());
};
