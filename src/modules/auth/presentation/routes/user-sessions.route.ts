import { RequestHandler, Router } from 'express';
import { UserSessionsController } from '../controllers/user-sessions.controller';
import { validationErrorMiddleware } from '../../../../shared/middleware/validation-error.middleware';
import { revokeSessionsSchema } from '../schemas/revoke.schema';

export const UserSessionsRouter = (
  controller: UserSessionsController,
  authenticate: RequestHandler,
): Router => {
  const router = Router();

  router.delete(
    '/:id/sessions',
    authenticate,
    validationErrorMiddleware(revokeSessionsSchema),
    controller.revokeSessions,
  );
  return router;
};
