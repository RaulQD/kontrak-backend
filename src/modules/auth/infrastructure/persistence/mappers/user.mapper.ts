import type { User as PrismaUser } from '../../../../../generated/prisma/client';
import { User } from '../../../domain/entities/user.entity';

export const UserMapper = {
  toDomain(row: PrismaUser): User {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      failedLoginAttempts: row.failedLoginAttempts,
      lockedUntil: row.lockedUntil,
      lastFailedLoginAt: row.lastFailedLoginAt,
      lockoutsCount: row.lockoutsCount,
      isActive: row.isActive,
    });
  },
  toPersistence(user: User) {
    return {
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
      lastFailedLoginAt: user.lastFailedLoginAt,
      lockoutsCount: user.lockoutsCount,
    };
  },
};
