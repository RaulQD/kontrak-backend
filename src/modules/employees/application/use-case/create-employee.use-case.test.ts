import { describe, expect, it, vi } from 'vitest';
import type {
  AuditContext,
  AuditEntry,
} from '../../../../shared/audit/audit-entry';
import { Employee } from '../../domain/entities/employee.entity';
import {
  DuplicateDocumentError,
  DuplicateEmailError,
  DuplicateEmployeeCodeError,
  InvalidEmployeeDataError,
  SensitiveFieldsForbiddenError,
  UbigeoNotFoundError,
} from '../../domain/errors/employee.error';
import type { ActorContext } from '../../domain/types';
import type { EmployeeView } from '../port/employee.repository.port';
import { CreateEmployeeUseCase } from './create-employee.use-case';
import { CreateEmployeeInput } from '../dto/create-employee.dto';

const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';
const NOW = new Date('2026-12-14T15:00:00.000Z');
const CONTEXT: AuditContext = {
  actorUserId: 'user-admin',
  ipAddress: '127.0.0.1',
  correlationId: 'req-1',
};
const ADMIN: ActorContext = {
  userId: 'user-admin',
  permissions: ['colaborador:crear', 'colaborador:leer_sensible'],
};
const SIN_SENSIBLE: ActorContext = {
  userId: 'user-x',
  permissions: ['colaborador:crear'],
};

const INPUT: CreateEmployeeInput = {
  documentType: 'DNI',
  documentNumber: '40506070',
  firstNames: 'MARIA ELENA',
  corporateEmail: 'Maria.Quispe@Empresa.PE ',
  lastNameFather: 'QUISPE',
  lastNameMother: 'ROJAS',
  hireDate: new Date('2026-08-17T00:00:00.000Z'),
};

/** Repositorio falso en memoria: create guarda, findViewById lee lo guardado. */
const makeRepository = (
  existing: {
    byDocument?: Employee;
    byCode?: Employee;
    byCorporateEmail?: Employee;
  } = {},
) => {
  let saved: Employee | null = null;
  const toView = (e: Employee): EmployeeView => ({
    ...e,
    nationality: e.nationality,
    updatedAt: NOW,
  });
  const repository = {
    list: vi.fn(),
    findById: vi.fn(),
    findByDocument: vi.fn().mockResolvedValue(existing.byDocument ?? null),
    findByEmployeeCode: vi.fn().mockResolvedValue(existing.byCode ?? null),
    findByCorporateEmail: vi
      .fn()
      .mockResolvedValue(existing.byCorporateEmail ?? null),
    create: vi.fn(async (e: Employee, _audit: AuditEntry) => {
      saved = e;
    }),
    findViewById: vi.fn(async () => (saved ? toView(saved) : null)),
    update: vi.fn(),
    softDelete: vi.fn(),
    hasContracts: vi.fn(),
  };
  return repository;
};

const makeUseCase = (repository = makeRepository(), ubigeoExists = true) =>
  new CreateEmployeeUseCase(
    { exists: vi.fn().mockResolvedValue(ubigeoExists) },
    repository,
    () => CONTEXT,
    () => ID,
    () => NOW,
  );

describe('CreateEmployeeUseCase', () => {
  it('crea con ACTIVO y PERUANA por defecto y devuelve la ficha', async () => {
    const repository = makeRepository();

    const output = await makeUseCase(repository).execute(INPUT, ADMIN);

    expect(output).toMatchObject({
      id: ID,
      status: 'ACTIVO',
      nationality: 'PERUANA',
      hireDate: '2026-08-17',
      corporateEmail: 'maria.quispe@empresa.pe', // normalizado por la entidad
      terminationDate: null,
      hasChildrenUnder18: false,
      essaludLifeInsurance: false,
    });
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('la auditoría es un CREATE con el contexto de la petición y solo newValues', async () => {
    const repository = makeRepository();

    await makeUseCase(repository).execute(INPUT, ADMIN);

    const audit = repository.create.mock.calls[0]?.[1];
    expect(audit).toMatchObject({
      ...CONTEXT,
      action: 'CREATE',
      entityType: 'employees',
      entityId: ID,
      oldValues: null,
    });
    expect(audit?.newValues).toMatchObject({
      documentNumber: '40506070',
      status: 'ACTIVO',
      hireDate: '2026-08-17T00:00:00.000Z',
    });
    expect(audit?.newValues).not.toHaveProperty('phone'); // null no se registra
  });

  it('sin leer_sensible responde sin las claves sensibles', async () => {
    const output = await makeUseCase().execute(INPUT, SIN_SENSIBLE);

    expect(output).not.toHaveProperty('hasChildrenUnder18');
    expect(output).not.toHaveProperty('essaludLifeInsurance');
  });

  it('sin leer_sensible no puede enviar campos sensibles (403)', async () => {
    const repository = makeRepository();

    await expect(
      makeUseCase(repository).execute(
        { ...INPUT, hasChildrenUnder18: true },
        SIN_SENSIBLE,
      ),
    ).rejects.toBeInstanceOf(SensitiveFieldsForbiddenError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('una invariante rota falla antes de consultar la base de datos', async () => {
    const repository = makeRepository();

    await expect(
      makeUseCase(repository).execute(
        { ...INPUT, documentNumber: '1234567' },
        ADMIN,
      ),
    ).rejects.toBeInstanceOf(InvalidEmployeeDataError);
    expect(repository.findByDocument).not.toHaveBeenCalled();
  });

  it('documento de un colaborador vivo: 409 y no escribe', async () => {
    const otro = Employee.create({ ...(await toProps()) }, 'otro-id', NOW);
    const repository = makeRepository({ byDocument: otro });

    await expect(
      makeUseCase(repository).execute(INPUT, ADMIN),
    ).rejects.toBeInstanceOf(DuplicateDocumentError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('código de empleado repetido: 409', async () => {
    const otro = Employee.create(await toProps(), 'otro-id', NOW);
    const repository = makeRepository({ byCode: otro });

    await expect(
      makeUseCase(repository).execute(
        { ...INPUT, employeeCode: 'EMP-001' },
        ADMIN,
      ),
    ).rejects.toBeInstanceOf(DuplicateEmployeeCodeError);
  });

  it('correo de otro colaborador: 409 y no escribe (US-020c)', async () => {
    const otro = Employee.create(await toProps(), 'otro-id', NOW);
    const repository = makeRepository({ byCorporateEmail: otro });

    await expect(
      makeUseCase(repository).execute(INPUT, ADMIN),
    ).rejects.toBeInstanceOf(DuplicateEmailError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('busca el correo ya normalizado', async () => {
    const repository = makeRepository();

    await makeUseCase(repository).execute(INPUT, ADMIN);

    expect(repository.findByCorporateEmail).toHaveBeenCalledWith(
      'maria.quispe@empresa.pe',
    );
  });

  it('sin employeeCode no consulta por código', async () => {
    const repository = makeRepository();

    await makeUseCase(repository).execute(INPUT, ADMIN);

    expect(repository.findByEmployeeCode).not.toHaveBeenCalled();
  });

  it('ubigeo inexistente: 422 y no escribe', async () => {
    const repository = makeRepository();

    await expect(
      makeUseCase(repository, false).execute(
        { ...INPUT, ubigeoId: '150101' },
        ADMIN,
      ),
    ).rejects.toBeInstanceOf(UbigeoNotFoundError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

const toProps = async () => ({
  employeeCode: 'EMP-001',
  documentType: 'DNI' as const,
  documentNumber: '40506070',
  firstNames: 'OTRA',
  lastNameFather: 'PERSONA',
  lastNameMother: 'X',
  sex: null,
  birthDate: null,
  maritalStatus: null,
  nationality: 'PERUANA',
  corporateEmail: 'maria.quispe@empresa.pe',
  personalEmail: null,
  phone: null,
  address: null,
  ubigeoId: null,
  hireDate: new Date('2026-01-01T00:00:00.000Z'),
  hasChildrenUnder18: false,
  essaludLifeInsurance: false,
  photoUrl: null,
});
