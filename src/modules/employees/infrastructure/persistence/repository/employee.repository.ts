import type {
  Prisma,
  PrismaClient,
} from '../../../../../generated/prisma/client';
import {
  EmployeeView,
  IEmployeeRepository,
  ReadOptions,
} from '../../../application/port/employee.repository.port';
import {
  DocumentType,
  EmployeeFilters,
  EmployeeUpdatePatch,
  Page,
} from '../../../domain/types';
import { EmployeeMapper } from '../mapper/employee.mapper';
import { EmployeeRow, FULL_SELECT, PUBLIC_SELECT } from '../employee.select';
import { AuditEntry } from '../../../../../shared/audit/audit-entry';
import { Employee } from '../../../domain/entities/employee.entity';
import { writeAudit } from '../../../../../platform/audit/audit-writer';
import { isRecordNotFound, violatedUniqueIndex } from '../prisma-error';
import {
  DuplicateDocumentError,
  DuplicateEmployeeCodeError,
  EmployeeNotFoundError,
  DuplicateEmailError,
} from '../../../domain/errors/employee.error';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async findByCorporateEmail(corporateEmail: string): Promise<Employee | null> {
    return this.findOne({
      corporateEmail: corporateEmail.trim().toLowerCase(),
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return this.findOne({ id });
  }
  async findByDocument(
    type: DocumentType,
    documentNumber: string,
  ): Promise<Employee | null> {
    return this.findOne({ documentType: type, documentNumber });
  }
  async findByEmployeeCode(code: string): Promise<Employee | null> {
    return this.findOne({ employeeCode: code });
  }
  async create(employe: Employee, audit: AuditEntry): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.employee.create({
          data: EmployeeMapper.toPersistence(employe),
        });
        await writeAudit(tx, audit);
      });
    } catch (error) {
      throw this.translate(error, employe);
    }
  }
  async update(
    employee: Employee,
    patch: EmployeeUpdatePatch,
    audit: AuditEntry,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.employee.update({
          where: { id: employee.id, deletedAt: null },
          data: EmployeeMapper.toUpdateData(patch),
        });
        await writeAudit(tx, audit);
      });
    } catch (error) {
      throw this.translate(error, employee);
    }
  }
  async softDelete(
    id: string,
    deletedAt: Date,
    audit: AuditEntry,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Solo deletedAt: anular no es cesar, status y terminationDate no se tocan (D4)
        await tx.employee.update({
          where: { id, deletedAt: null },
          data: { deletedAt },
        });
        await writeAudit(tx, audit);
      });
    } catch (error) {
      if (isRecordNotFound(error)) throw new EmployeeNotFoundError(id);
      throw error;
    }
  }
  async hasContracts(employeeId: string): Promise<boolean> {
    // Cuenta también los contratos anulados: siguen siendo un rastro legal
    // que referencia al colaborador. findFirst se detiene en el primero.
    const contract = await this.prisma.contract.findFirst({
      where: { employeeId },
      select: { id: true },
    });
    return contract !== null;
  }

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
    const escapeLike = (value: string): string =>
      value.replace(/[\\%_]/g, '\\$&');
    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          {
            fullName: {
              contains: escapeLike(filters.search),
              mode: 'insensitive',
            },
          },
          {
            documentNumber: {
              contains: escapeLike(filters.search),
              mode: 'insensitive',
            },
          },
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
  private async findOne(
    where: Prisma.EmployeeWhereInput,
  ): Promise<Employee | null> {
    const row = await this.prisma.employee.findFirst({
      where: { ...where, deletedAt: null },
      select: FULL_SELECT,
    });
    return row ? EmployeeMapper.toEntity(row) : null;
  }
  private translate(error: unknown, employee: Employee): unknown {
    switch (violatedUniqueIndex(error)) {
      case 'ux_employees_doc':
        return new DuplicateDocumentError(
          employee.documentType,
          employee.documentNumber,
        );
      case 'ux_employees_code':
        return new DuplicateEmployeeCodeError(employee.employeeCode ?? '');
      case 'ux_employees_corporate_email':
        return new DuplicateEmailError(employee.corporateEmail);
    }
    if (isRecordNotFound(error)) return new EmployeeNotFoundError(employee.id);
    return error;
  }
}
