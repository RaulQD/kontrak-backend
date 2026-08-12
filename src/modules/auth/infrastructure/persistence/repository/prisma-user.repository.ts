import { PrismaClient } from '../../../../../generated/prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/ports/user.repository.port';
import { UserMapper } from '../mappers/user.mapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPermissionsByUserId(userId: string): Promise<string[]> {
    const rows = await this.prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: { userRoles: { some: { userId } } },
          },
        },
      },
      select: { code: true },
    });
    return rows.map((row) => row.code);
  }
  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    return row ? UserMapper.toDomain(row) : null;
  }
  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toPersistence(user),
    });
  }
}
