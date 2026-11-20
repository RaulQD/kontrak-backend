import { AsyncResource } from 'node:async_hooks';
import { RequestHandler } from 'express';

export const preserveRequestContext =
  (middleware: RequestHandler): RequestHandler =>
  (req, res, next) =>
    middleware(req, res, AsyncResource.bind(next));
