import {
  AuditAction,
  AuditContextProvider,
  AuditEntry,
} from '../../../../shared/audit/audit-entry';
import { diffAuditValues } from '../../../../shared/audit/diff-audit-values';
import { Employee } from '../../domain/entities/employee.entity';
import {
  DuplicateDocumentError,
  DuplicateEmployeeCodeError,
  EmployeeNotFoundError,
  SensitiveFieldsForbiddenError,
  UbigeoNotFoundError,
} from '../../domain/errors/employee.error';
import {
  canReadSensitive,
  SENSITIVE_FIELDS,
} from '../../domain/sensitive-fields';
import { ActorContext } from '../../domain/types';
import {
  CreateEmployeeInput,
  toNewEmployeeProps,
} from '../dto/create-employee.dto';
import { EmployeeOutput, toEmployeeOutput } from '../dto/employee.dto';
import {
  IEmployeeRepository,
  IUbigeoReader,
} from '../port/employee.repository.port';

export class CreateEmployeeUseCase {
  constructor(
    private readonly ubigeoReader: IUbigeoReader,
    private readonly employeeRepository: IEmployeeRepository,
    private readonly auditContextProvider: AuditContextProvider,
    private readonly newId: () => string = () => crypto.randomUUID(),
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute(
    input: CreateEmployeeInput,
    actor: ActorContext,
  ): Promise<EmployeeOutput> {
    // 1. D6: quien no puede ver un campo sensible tampoco puede escribirlo.
    this.assertCanWriteSensitive(input, actor);
    // 2. Invariantes del dominio: 422 antes de tocar la base de datos.
    const employee = Employee.create(
      toNewEmployeeProps(input),
      this.newId(),
      this.clock(),
    );
    //Reglas de negocio
    if (
      employee.ubigeoId !== null &&
      !(await this.ubigeoReader.exists(employee.ubigeoId))
    ) {
      throw new UbigeoNotFoundError(employee.ubigeoId);
    }
    const owner = await this.employeeRepository.findByDocument(
      employee.documentType,
      employee.documentNumber,
    );
    if (owner) {
      throw new DuplicateDocumentError(
        employee.documentType,
        employee.documentNumber,
      );
    }
    if (
      employee.employeeCode !== null &&
      (await this.employeeRepository.findByEmployeeCode(employee.employeeCode))
    ) {
      throw new DuplicateEmployeeCodeError(employee.employeeCode);
    }
    await this.employeeRepository.create(employee, this.auditEntry(employee));

    const includeSensitive = canReadSensitive(actor.permissions);
    const view = await this.employeeRepository.findViewById(employee.id, {
      includeSensitive,
    });
    if (!view) {
      throw new EmployeeNotFoundError(employee.id);
    }
    return toEmployeeOutput(view, includeSensitive);
  }

  private assertCanWriteSensitive(
    input: CreateEmployeeInput,
    actor: ActorContext,
  ): void {
    if (canReadSensitive(actor.permissions)) return;
    const sent = SENSITIVE_FIELDS.filter((field) => input[field] !== undefined);
    if (sent.length > 0) throw new SensitiveFieldsForbiddenError(sent);
  }

  private auditEntry(employee: Employee): AuditEntry {
    // Un alta es un diff contra nada: newValues lleva los campos con valor,
    // con las fechas ya en ISO. oldValues es null porque antes no existía.
    const diff = diffAuditValues({}, { ...employee });
    return {
      ...this.auditContextProvider(),
      action: AuditAction.CREATE,
      entityType: 'employees',
      entityId: employee.id,
      oldValues: null,
      newValues: diff?.newValues ?? null,
    };
  }
}
