import type {
  Prisma,
  PrismaClient,
} from '../../../../../generated/prisma/client';
import {
  EmployeeView,
  IEmployeeRepository,
  ReadOptions,
} from '../../../application/port/employee.repository.port';
import { EmployeeFilters, Page } from '../../../domain/types';
import { EmployeeMapper } from '../mapper/employee.mapper';
import { EmployeeRow, FULL_SELECT, PUBLIC_SELECT } from '../employee.select';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findViewById(
    id: string,
    { includeSensitive }: ReadOptions,
  ): Promise<EmployeeView | null> {
    const where = { id, deletedAt: null };
    const row: EmployeeRow | null = includeSensitive
      ? await this.prisma.employee.findFirst({ where, select: FULL_SELECT })
      : await this.prisma.employee.findFirst({ where, select: PUBLIC_SELECT });
    return row ? EmployeeMapper.toView(row) : null;
  }
  async list(
    filters: EmployeeFilters,
    { includeSensitive }: ReadOptions,
  ): Promise<Page<EmployeeView>> {
    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' } },
          { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };
    const args = {
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    } satisfies Prisma.EmployeeFindManyArgs;

    const [rows, total] = await Promise.all([
      includeSensitive
        ? this.prisma.employee.findMany({ ...args, select: FULL_SELECT })
        : this.prisma.employee.findMany({ ...args, select: PUBLIC_SELECT }),

      this.prisma.employee.count({ where }),
    ]);
    const typedRows: EmployeeRow[] = rows;

    return {
      items: typedRows.map((row) => EmployeeMapper.toView(row)),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }
}
