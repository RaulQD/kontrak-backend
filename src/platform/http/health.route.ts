import { Router } from 'express';
import { logger } from '../../shared/utils/logger';
import { OK, SERVICE_UNAVAILABLE } from '../../shared/constants/http';

export const healthRouter = (
  checkDatabase: () => Promise<unknown>,
  timeoutMs = 3000,
): Router => {
  const router = Router();

  router.get('/health', async (_req, res) => {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Sin respuesta en ${timeoutMs} ms`)),
        timeoutMs,
      );
    });
    try {
      await Promise.race([checkDatabase(), timeout]);
      res.status(OK).json({ success: true, status: 'ok', database: 'up' });
    } catch (error) {
      logger.warn({ err: error }, 'Health check: la base de datos no responde');
      res
        .status(SERVICE_UNAVAILABLE)
        .json({ success: false, status: 'error', database: 'down' });
    } finally {
      clearTimeout(timer);
    }
  });

  return router;
};
