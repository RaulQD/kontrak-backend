import { AuditEntry } from '../../../../shared/audit/audit-entry';
import { Employee, EmployeeProps } from '../../domain/entities/employee.entity';
import { SensitiveField } from '../../domain/sensitive-fields';
import {
  DocumentType,
  EmployeeFilters,
  EmployeeUpdatePatch,
  Page,
} from '../../domain/types';

export type EmployeeView = Omit<EmployeeProps, SensitiveField | 'nationality'> &
  Partial<Pick<EmployeeProps, SensitiveField>> & {
    // La columna admite NULL (schema.prisma: String?), y una fila legacy puede
    // no tenerla. La vista lo refleja en vez de inventar "PERUANA".
    nationality: string | null;
    updatedAt: Date;
  };

export interface ReadOptions {
  includeSensitive: boolean;
}
export type EmployeeField = keyof EmployeeProps;

export interface IEmployeeRepository {
  findViewById(id: string, opts: ReadOptions): Promise<EmployeeView | null>;
  list(
    filters: EmployeeFilters,
    opts: ReadOptions,
  ): Promise<Page<EmployeeView>>;
  findById(id: string): Promise<Employee | null>;
  findByDocument(type: DocumentType, number: string): Promise<Employee | null>;
  findByEmployeeCode(code: string): Promise<Employee | null>;
  findByCorporateEmail(corporateEmail: string): Promise<Employee | null>;
  create(employe: Employee, audit: AuditEntry): Promise<void>;
  update(
    employee: Employee,
    patch: EmployeeUpdatePatch,
    audit: AuditEntry,
  ): Promise<void>;
  softDelete(id: string, deletedAt: Date, audit: AuditEntry): Promise<void>;
  hasContracts(employeeId: string): Promise<boolean>;
}
export interface IUbigeoReader {
  exists(id: string): Promise<boolean>;
}
