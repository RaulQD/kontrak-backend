import { Request } from 'express';
import { UnauthorizedError } from '../../../../shared/utils/app-error-v2';

export const getAuth = (req: Request) => {
  if (!req.auth) {
    throw new UnauthorizedError('Token de acceso');
  }
  return req.auth;
};
