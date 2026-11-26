import { describe, expect, it, vi } from 'vitest';
import type { AuditContext } from '../../../../shared/audit/audit-entry';
import {
  Employee,
  NewEmployeeProps,
} from '../../domain/entities/employee.entity';
import {
  EmployeeHasContractsError,
  EmployeeNotFoundError,
} from '../../domain/errors/employee.error';
import { DeleteEmployeeUseCase } from './delete-employee.use-case';

const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';
const NOW = new Date('2026-12-14T15:00:00.000Z');
const CONTEXT: AuditContext = {
  actorUserId: 'user-admin',
  ipAddress: '127.0.0.1',
  correlationId: 'req-1',
};

const PROPS: NewEmployeeProps = {
  employeeCode: 'EMP-001',
  documentType: 'DNI',
  documentNumber: '40506070',
  firstNames: 'MARIA ELENA',
  lastNameFather: 'QUISPE',
  lastNameMother: 'ROJAS',
  sex: null,
  birthDate: null,
  maritalStatus: null,
  nationality: 'PERUANA',
  email: null,
  personalEmail: null,
  phone: null,
  address: null,
  ubigeoId: null,
  hireDate: new Date('2026-08-17T00:00:00.000Z'),
  hasChildrenUnder18: false,
  essaludLifeInsurance: false,
  photoUrl: null,
};

const makeRepository = (
  opts: { missing?: boolean; contracts?: boolean } = {},
) => ({
  list: vi.fn(),
  findViewById: vi.fn(),
  findById: vi
    .fn()
    .mockResolvedValue(opts.missing ? null : Employee.create(PROPS, ID, NOW)),
  findByDocument: vi.fn(),
  findByEmployeeCode: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasContracts: vi.fn().mockResolvedValue(opts.contracts ?? false),
});

const makeUseCase = (repository = makeRepository()) =>
  new DeleteEmployeeUseCase(
    repository,
    () => CONTEXT,
    () => NOW,
  );

describe('DeleteEmployeeUseCase (anulación registral, D4)', () => {
  it('fija deletedAt con la fecha del reloj y audita un DELETE', async () => {
    const repository = makeRepository();

    await makeUseCase(repository).execute(ID);

    expect(repository.softDelete).toHaveBeenCalledWith(ID, NOW, {
      ...CONTEXT,
      action: 'DELETE',
      entityType: 'employees',
      entityId: ID,
      oldValues: { deletedAt: null },
      newValues: { deletedAt: NOW.toISOString() },
    });
  });

  it('revisa los contratos del mismo colaborador', async () => {
    const repository = makeRepository();

    await makeUseCase(repository).execute(ID);

    expect(repository.hasContracts).toHaveBeenCalledWith(ID);
  });

  it('inexistente o ya anulado: 404 y no toca nada', async () => {
    const repository = makeRepository({ missing: true });

    await expect(makeUseCase(repository).execute(ID)).rejects.toBeInstanceOf(
      EmployeeNotFoundError,
    );
    expect(repository.hasContracts).not.toHaveBeenCalled();
    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('con contratos: 409 que remite al cese, y no anula', async () => {
    const repository = makeRepository({ contracts: true });

    const error = await makeUseCase(repository)
      .execute(ID)
      .catch((e) => e);

    expect(error).toBeInstanceOf(EmployeeHasContractsError);
    expect(error.statusCode).toBe(409);
    expect(error.message).toMatch(/cese/);
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
