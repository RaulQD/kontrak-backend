import { EmployeeProps } from '../../domain/entities/employee.entity';
import { SensitiveField } from '../../domain/sensitive-fields';
import { EmployeeFilters, Page } from '../../domain/types';

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

export interface IEmployeeRepository {
  findViewById(id: string, opts: ReadOptions): Promise<EmployeeView | null>;
  list(
    filters: EmployeeFilters,
    opts: ReadOptions,
  ): Promise<Page<EmployeeView>>;
  // US-020b agregará findById(id): Promise<Employee | null>, siempre completo
}
