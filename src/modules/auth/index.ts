import { env } from '../../config/env';
import { prisma } from '../../platform/database/prisma';
import { LoginUseCase } from './application/login.use-case';
import { RefreshSessionUseCase } from './application/refresh-session.use-case';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/repository/prisma-refresh-token.repository';
import { PrismaUserRepository } from './infrastructure/persistence/repository/prisma-user.repository';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { CryptoRefreshTokenGenerator } from './infrastructure/security/crypo-refresh-token-generator';
import { JwtTokenSigner } from './infrastructure/security/jwt-token-signer';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthRouter } from './presentation/routes/auth.routes';

const useRepo = new PrismaUserRepository(prisma);
const refreshRepo = new PrismaRefreshTokenRepository(prisma);
const hasher = new BcryptPasswordHasher();
const signer = new JwtTokenSigner(env.JWT_ACCESS_SECRET);

const refreshGen = new CryptoRefreshTokenGenerator();

const loginUserCase = new LoginUseCase(
  useRepo,
  refreshRepo,
  hasher,
  signer,
  refreshGen,
  { accessTtlSeconds: Number(env.JWT_ACCESS_EXPIRES), refreshTtlDays: 7 },
);
const refreshSessionUseCase = new RefreshSessionUseCase(
  useRepo,
  refreshRepo,
  signer,
  refreshGen,
  { accessTtlSeconds: Number(env.JWT_ACCESS_EXPIRES), refreshTtlDays: 7 },
);
const authController = new AuthController(loginUserCase, refreshSessionUseCase);

export const authRouter = AuthRouter(authController);
