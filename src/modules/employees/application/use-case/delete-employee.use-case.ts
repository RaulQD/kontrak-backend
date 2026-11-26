import {
  AuditAction,
  AuditContextProvider,
  AuditEntry,
} from '../../../../shared/audit/audit-entry';
import { Employee } from '../../domain/entities/employee.entity';
import {
  EmployeeHasContractsError,
  EmployeeNotFoundError,
} from '../../domain/errors/employee.error';
import { IEmployeeRepository } from '../port/employee.repository.port';

export class DeleteEmployeeUseCase {
  constructor(
    private readonly employeeRepository: IEmployeeRepository,
    private readonly auditContextProvider: AuditContextProvider,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute(id: string): Promise<void> {
    // validar si el empleado existe
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new EmployeeNotFoundError(id);
    }
    //Validamos si el usuario tiene un contrato de por medio
    const employeeHasContract = await this.employeeRepository.hasContracts(
      employee.id,
    );
    if (employeeHasContract) {
      throw new EmployeeHasContractsError(
        'El colaborador tiene contratos; si dejó de trabajar, regístralo como cese',
      );
    }
    const deletedAt = this.clock();
    await this.employeeRepository.softDelete(
      employee.id,
      deletedAt,
      this.auditEntry(employee, deletedAt),
    );
  }

  private auditEntry(employee: Employee, now: Date): AuditEntry {
    return {
      ...this.auditContextProvider(),
      action: AuditAction.DELETE,
      entityType: 'employees',
      entityId: employee.id,
      oldValues: { deletedAt: null },
      newValues: { deletedAt: now.toISOString() },
    };
  }
}
