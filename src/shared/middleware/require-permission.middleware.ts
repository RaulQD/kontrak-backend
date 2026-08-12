import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ForbiddenError } from '../utils/app-error-v2';
import { getAuth } from '../helpers';
import { permissionLabel, PermissionCode } from '../constants/permissions';

export const requirePermission =
  (...codes: PermissionCode[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { permissions } = getAuth(req);
    const hasPermission = codes.some((code) => permissions.includes(code));
    if (!hasPermission) {
      const tags = codes.map(permissionLabel).join(' o ');
      throw new ForbiddenError(`No tienes permisos para ${tags}`);
    }
    next();
  };
