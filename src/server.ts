import { Application } from 'express';
import { logger } from './shared/utils/logger';

export class Server {
  public readonly app: Application;
  private readonly logger = logger;
  constructor(app: Application) {
    this.app = app;
  }
  public listen(port: number): void {
    this.app.listen(port, () => {
      this.logger.info(`=========== Server running on port ${port} ==========`);
      this.logger.info(
        `=========== Environment: ${process.env.NODE_ENV || 'development'} ==========`,
      );
    });
  }
  public close(): void {
    this.logger.info('Server closing...');
  }
}
