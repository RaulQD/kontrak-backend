import { diffAuditValues } from '../../../../shared/audit/diff-audit-values';
import {
  DuplicateDocumentError,
  DuplicateEmailError,
  DuplicateEmployeeCodeError,
  EmployeeNotFoundError,
  SensitiveFieldsForbiddenError,
  TerminationNotAllowedError,
  UbigeoNotFoundError,
} from '../../domain/errors/employee.error';
import {
  canReadSensitive,
  SENSITIVE_FIELDS,
} from '../../domain/sensitive-fields';
import { ActorContext } from '../../domain/types';
import { EmployeeOutput, toEmployeeOutput } from '../dto/employee.dto';
import {
  EmployeeUpdateInput,
  toEmployeeUpdatePatch,
} from '../dto/update-employee.dto';
import {
  IEmployeeRepository,
  IUbigeoReader,
} from '../port/employee.repository.port';
import {
  AuditAction,
  AuditContextProvider,
  AuditValues,
} from '../../../../shared/audit/audit-entry';

export class UpdateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: IEmployeeRepository,
    private readonly ubigeoReader: IUbigeoReader,
    private readonly auditContext: AuditContextProvider,
  ) {}

  async execute(
    id: string,
    input: EmployeeUpdateInput,
    actor: ActorContext,
  ): Promise<EmployeeOutput> {
    // 1. Permisos (D5 y D6), antes de leer nada.
    if (input.status !== undefined || input.terminationDate !== undefined) {
      throw new TerminationNotAllowedError(
        'El cese se registra con su propio proceso (US-022)',
      );
    }
    const sentSensitive = SENSITIVE_FIELDS.filter(
      (field) => input[field] !== undefined,
    );
    // VALIDAR LA EDICIÓN DE DATOS SENSIBLES
    if (sentSensitive.length && !canReadSensitive(actor.permissions)) {
      throw new SensitiveFieldsForbiddenError(sentSensitive);
    }
    // 2. existencia
    const current = await this.employeeRepository.findById(id);
    if (!current) {
      throw new EmployeeNotFoundError(id);
    }

    // 3. Invariantes del dominio (422), sin tocar la base de datos.
    const patch = toEmployeeUpdatePatch(input);
    const next = current.withPatch(patch);

    // Se escribe el correo como lo normalizó la entidad, no como llegó.
    if (patch.corporateEmail !== undefined)
      patch.corporateEmail = next.corporateEmail;

    // 4. Reglas que necesitan la base de datos, solo si el dato cambió.
    if (
      next.ubigeoId !== null &&
      next.ubigeoId !== current.ubigeoId &&
      !(await this.ubigeoReader.exists(next.ubigeoId))
    ) {
      throw new UbigeoNotFoundError(next.ubigeoId);
    }

    //VALIDAR TIPO DE DOCUMENTO Y NRO DE DOCUENTO
    const changed =
      next.documentType !== current.documentType ||
      next.documentNumber !== current.documentNumber;
    if (changed) {
      const owner = await this.employeeRepository.findByDocument(
        next.documentType,
        next.documentNumber,
      );
      if (owner && owner.id !== current.id) {
        throw new DuplicateDocumentError(
          next.documentType,
          next.documentNumber,
        );
      }
    }
    //VALIDAR CODIGO DE EMPELADO
    if (
      next.employeeCode !== null &&
      next.employeeCode !== current.employeeCode
    ) {
      const owner = await this.employeeRepository.findByEmployeeCode(
        next.employeeCode,
      );
      if (owner && owner.id !== current.id) {
        throw new DuplicateEmployeeCodeError(next.employeeCode);
      }
    }
    //VALIDAR CORREO CORPORATIVO
    if (next.corporateEmail !== current.corporateEmail) {
      const owner = await this.employeeRepository.findByCorporateEmail(
        next.corporateEmail,
      );
      if (owner && owner.id !== current.id) {
        throw new DuplicateEmailError(next.corporateEmail);
      }
    }

    const diff = diffAuditValues({ ...current }, { ...next });
    if (diff) {
      await this.employeeRepository.update(
        next,
        patch,
        this.auditEntry(id, diff),
      );
    }
    return this.readBack(id, actor);
  }

  private async readBack(
    id: string,
    actor: ActorContext,
  ): Promise<EmployeeOutput> {
    const includeSensitive = canReadSensitive(actor.permissions);
    const view = await this.employeeRepository.findViewById(id, {
      includeSensitive,
    });
    if (!view) throw new EmployeeNotFoundError(id);
    return toEmployeeOutput(view, includeSensitive);
  }

  private auditEntry(
    id: string,
    diff: { oldValues: AuditValues; newValues: AuditValues },
  ) {
    return {
      ...this.auditContext(),
      action: AuditAction.UPDATE,
      entityType: 'employees',
      entityId: id,
      ...diff,
    };
  }
}
