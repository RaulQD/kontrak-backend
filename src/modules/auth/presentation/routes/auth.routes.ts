import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationErrorMiddleware } from '../../../../shared/middleware/validation-error.middleware';
import { loginSchema } from '../schemas/login.schema';

export const AuthRouter = (controller: AuthController): Router => {
  const router = Router();
  router.post(
    '/login',
    validationErrorMiddleware(loginSchema),
    controller.login,
  );

  return router;
};
