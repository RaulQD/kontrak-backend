import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ForbiddenError } from '../../../../shared/utils/app-error-v2';
import {
  permissionLabel,
  PermissionCode,
} from '../../../../shared/constants/permissions';
import { getAuth } from './get-auth';

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
