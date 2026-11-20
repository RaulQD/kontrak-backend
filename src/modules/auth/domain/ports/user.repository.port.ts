import { User } from '../entities/user.entity';
import { UserAccessStatus } from '../types';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findPermissionsByUserId(userId: string): Promise<string[]>;
  findAccessStatus(id: string): Promise<UserAccessStatus | null>;
  markTokensRevoked(id: string, at: Date): Promise<void>;
}
