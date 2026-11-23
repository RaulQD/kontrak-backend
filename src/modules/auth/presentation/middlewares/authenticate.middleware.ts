import { Request, Response, NextFunction } from 'express';
import { catchError } from '../../../../shared/utils/catch-error';
import { UnauthorizedError } from '../../../../shared/utils/app-error-v2';
import { setRequestActor } from '../../../../platform/http/request-context';
import { VerifyAccessUseCase } from '../../application/use-case/verify-access.use-case';

export const authenticateMiddleware = (verifyAccess: VerifyAccessUseCase) =>
  catchError(async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }
    const token = header.split(' ')[1];
    if (token === '') {
      throw new UnauthorizedError('Token de acceso requerido');
    }
    const payload = await verifyAccess.execute(token);
    setRequestActor(payload.sub);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      permissions: payload.permissions,
    };

    next();
  });
