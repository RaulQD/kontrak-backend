import { Application } from 'express';
import { logger } from './shared/utils/logger';

export class Server {
  public readonly app: Application;
  private readonly logger = logger;
  constructor(app: Application) {
    this.app = app;
  }
  public listen(port: number): void {
    const server = this.app.listen(port, () => {
      this.logger.info(`=========== Server running on port ${port} ==========`);
      this.logger.info(
        `=========== Environment: ${process.env.NODE_ENV || 'development'} ==========`,
      );
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        this.logger.error(
          `Port ${port} is already in use. Please choose a different port.`,
        );
      } else {
        this.logger.error({ err }, 'Error al iniciar el servidor HTTP');
      }
      process.exit(1);
    });
  }
  public close(): void {
    this.logger.info('Server closing...');
  }
}
