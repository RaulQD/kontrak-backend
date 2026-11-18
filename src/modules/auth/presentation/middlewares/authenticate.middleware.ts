import { Request, Response, NextFunction } from 'express';
import { ITokenSigner } from '../../domain/ports/token-signer.port';
import { catchError } from '../../../../shared/utils/catch-error';
import { UnauthorizedError } from '../../../../shared/utils/app-error-v2';

export const authenticateMiddleware = (signer: ITokenSigner) =>
  catchError(async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }
    const token = header.split(' ')[1];
    if (token === '') {
      throw new UnauthorizedError('Token de acceso requerido');
    }
    const payload = signer.verifyAccess(token);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      permissions: payload.permissions,
    };

    next();
  });
