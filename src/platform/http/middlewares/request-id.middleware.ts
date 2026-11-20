import { randomUUID } from 'node:crypto';
import { RequestHandler } from 'express';
import { runWithRequestContext } from '../request-context';

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  runWithRequestContext({ requestId, ipAddress: req.ip ?? null }, () => next());
};
