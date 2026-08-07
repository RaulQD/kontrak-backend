import { env } from '../../config/env';
import { prisma } from '../../platform/database/prisma';
import { authenticateMiddleware } from '../../shared/middleware/autenticate.middleware';
import { DeleteSessionUseCase } from './application/delete-session.use-case';
import { AuthTokenConfig, LoginUseCase } from './application/login.use-case';
import { LogoutUseCase } from './application/logout.use-case';
import { RefreshSessionUseCase } from './application/refresh-session.use-case';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/repository/prisma-refresh-token.repository';
import { PrismaUserRepository } from './infrastructure/persistence/repository/prisma-user.repository';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { CryptoRefreshTokenGenerator } from './infrastructure/security/crypto-refresh-token-generator';
import { JwtTokenSigner } from './infrastructure/security/jwt-token-signer';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserSessionsController } from './presentation/controllers/user-sessions.controller';
import { AuthRouter } from './presentation/routes/auth.routes';
import { UserSessionsRouter } from './presentation/routes/user-sessions.route';

const useRepo = new PrismaUserRepository(prisma);
const refreshRepo = new PrismaRefreshTokenRepository(prisma);
const hasher = new BcryptPasswordHasher();
const signer = new JwtTokenSigner(env.JWT_ACCESS_SECRET);
export const authenticate = authenticateMiddleware(signer);
const refreshGen = new CryptoRefreshTokenGenerator();

const tokenConfig: AuthTokenConfig = {
  accessTtlSeconds: env.JWT_ACCESS_EXPIRES, // 900
  refreshTtlSeconds: env.JWT_REFRESH_EXPIRES, // 7
};
const loginUserCase = new LoginUseCase(
  useRepo,
  refreshRepo,
  hasher,
  signer,
  refreshGen,
  tokenConfig,
);

const refreshSessionUseCase = new RefreshSessionUseCase(
  useRepo,
  refreshRepo,
  signer,
  refreshGen,
  tokenConfig,
);
const logoutUseCase = new LogoutUseCase(refreshRepo, refreshGen);
const authController = new AuthController(
  loginUserCase,
  refreshSessionUseCase,
  logoutUseCase,
  tokenConfig.refreshTtlSeconds,
);

const deleteSessionUseCase = new DeleteSessionUseCase(useRepo, refreshRepo);
const userSessionsController = new UserSessionsController(deleteSessionUseCase);
export const authRouter = AuthRouter(authController);
export const userSessionsRouter = UserSessionsRouter(userSessionsController);
