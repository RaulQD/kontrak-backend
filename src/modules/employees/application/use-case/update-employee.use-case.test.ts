import { describe, expect, it, vi } from 'vitest';
import type {
  AuditContext,
  AuditEntry,
} from '../../../../shared/audit/audit-entry';
import {
  Employee,
  NewEmployeeProps,
} from '../../domain/entities/employee.entity';
import {
  DuplicateDocumentError,
  DuplicateEmailError,
  DuplicateEmployeeCodeError,
  EmployeeNotFoundError,
  InvalidEmployeeDataError,
  SensitiveFieldsForbiddenError,
  TerminationNotAllowedError,
  UbigeoNotFoundError,
} from '../../domain/errors/employee.error';
import type { ActorContext, EmployeeUpdatePatch } from '../../domain/types';
import type {
  EmployeeView,
  ReadOptions,
} from '../port/employee.repository.port';
import { UpdateEmployeeUseCase } from './update-employee.use-case';

const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';
const OTRO_ID = '2f4b6d1c-3e10-4f9b-9a57-7d0b6c0e0a0e';
const NOW = new Date('2026-12-14T15:00:00.000Z');
const CONTEXT: AuditContext = {
  actorUserId: 'user-admin',
  ipAddress: '127.0.0.1',
  correlationId: 'req-1',
};
const ADMIN: ActorContext = {
  userId: 'user-admin',
  permissions: ['colaborador:editar', 'colaborador:leer_sensible'],
};
const ANALISTA: ActorContext = {
  userId: 'user-analyst',
  permissions: ['colaborador:editar'],
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
  corporateEmail: 'maria.quispe@empresa.pe',
  personalEmail: null,
  phone: '900000001',
  address: 'JR. CUSCO 100',
  ubigeoId: '150101',
  hireDate: new Date('2026-08-17T00:00:00.000Z'),
  hasChildrenUnder18: false,
  essaludLifeInsurance: false,
  photoUrl: null,
};

const otro = (cambios: Partial<NewEmployeeProps>) =>
  Employee.create({ ...PROPS, ...cambios }, OTRO_ID, NOW);

/**
 * Repositorio falso en memoria: findById devuelve la ficha actual, update la
 * reemplaza y findViewById lee la última versión, con la forma que pide la
 * lectura (sin las claves sensibles si no hay permiso).
 */
const makeRepository = (
  opts: {
    missing?: boolean;
    byDocument?: Employee;
    byCode?: Employee;
    byCorporateEmail?: Employee;
  } = {},
) => {
  let saved = Employee.create(PROPS, ID, NOW);
  const toView = (e: Employee, { includeSensitive }: ReadOptions) => {
    const full: EmployeeView = { ...e, updatedAt: NOW };
    if (includeSensitive) return full;
    const {
      hasChildrenUnder18: _hijos,
      essaludLifeInsurance: _seguro,
      ...publica
    } = full;
    return publica;
  };
  return {
    list: vi.fn(),
    findById: vi.fn().mockResolvedValue(opts.missing ? null : saved),
    findByDocument: vi.fn().mockResolvedValue(opts.byDocument ?? null),
    findByEmployeeCode: vi.fn().mockResolvedValue(opts.byCode ?? null),
    findByCorporateEmail: vi
      .fn()
      .mockResolvedValue(opts.byCorporateEmail ?? null),
    create: vi.fn(),
    update: vi.fn(
      async (
        next: Employee,
        _patch: EmployeeUpdatePatch,
        _audit: AuditEntry,
      ) => {
        saved = next;
      },
    ),
    softDelete: vi.fn(),
    hasContracts: vi.fn(),
    findViewById: vi.fn(async (_id: string, read: ReadOptions) =>
      toView(saved, read),
    ),
  };
};

const makeUseCase = (repository = makeRepository(), ubigeoExists = true) => {
  const ubigeos = { exists: vi.fn().mockResolvedValue(ubigeoExists) };
  const useCase = new UpdateEmployeeUseCase(repository, ubigeos, () => CONTEXT);
  return { useCase, repository, ubigeos };
};

describe('UpdateEmployeeUseCase', () => {
  describe('permisos (D5 y D6), antes de leer la ficha', () => {
    it.each([
      ['status', { status: 'CESADO' }],
      ['terminationDate', { terminationDate: '2026-09-01' }],
    ])('rechaza el intento de cese con %s (403)', async (_campo, input) => {
      const { useCase, repository } = makeUseCase();

      const error = await useCase.execute(ID, input, ADMIN).catch((e) => e);

      expect(error).toBeInstanceOf(TerminationNotAllowedError);
      expect(error.statusCode).toBe(403);
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('sin leer_sensible no puede editar un campo sensible (403)', async () => {
      const { useCase, repository } = makeUseCase();

      const error = await useCase
        .execute(ID, { hasChildrenUnder18: true }, ANALISTA)
        .catch((e) => e);

      expect(error).toBeInstanceOf(SensitiveFieldsForbiddenError);
      expect(error.statusCode).toBe(403);
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('con leer_sensible sí puede editarlos', async () => {
      const { useCase, repository } = makeUseCase();

      const output = await useCase.execute(
        ID,
        { hasChildrenUnder18: true, essaludLifeInsurance: true },
        ADMIN,
      );

      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(output).toMatchObject({
        hasChildrenUnder18: true,
        essaludLifeInsurance: true,
      });
    });
  });

  it('colaborador inexistente o anulado: 404 y no escribe', async () => {
    const { useCase, repository } = makeUseCase(
      makeRepository({ missing: true }),
    );

    await expect(
      useCase.execute(ID, { phone: '987654321' }, ADMIN),
    ).rejects.toBeInstanceOf(EmployeeNotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('una invariante rota falla antes de consultar duplicados (422)', async () => {
    const { useCase, repository } = makeUseCase();

    await expect(
      useCase.execute(ID, { documentNumber: '1234567' }, ADMIN),
    ).rejects.toBeInstanceOf(InvalidEmployeeDataError);
    expect(repository.findByDocument).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  describe('qué escribe', () => {
    it('edición parcial: el patch y la auditoría llevan solo lo que cambió', async () => {
      const { useCase, repository } = makeUseCase();

      const output = await useCase.execute(
        ID,
        { phone: '987654321', address: undefined },
        ADMIN,
      );

      const [next, patch, audit] = repository.update.mock.calls[0] ?? [];
      expect(next?.phone).toBe('987654321');
      expect(patch).toEqual({ phone: '987654321' });
      expect(audit).toEqual({
        ...CONTEXT,
        action: 'UPDATE',
        entityType: 'employees',
        entityId: ID,
        oldValues: { phone: '900000001' },
        newValues: { phone: '987654321' },
      });
      expect(output).toMatchObject({
        phone: '987654321',
        address: 'JR. CUSCO 100',
      });
    });

    it('null borra un campo opcional', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { address: null }, ADMIN);

      const [, patch, audit] = repository.update.mock.calls[0] ?? [];
      expect(patch).toEqual({ address: null });
      expect(audit).toMatchObject({
        oldValues: { address: 'JR. CUSCO 100' },
        newValues: { address: null },
      });
    });

    it('si los valores no cambian, no escribe ni audita, pero responde la ficha', async () => {
      const { useCase, repository } = makeUseCase();

      const output = await useCase.execute(
        ID,
        { phone: '900000001', documentNumber: '40506070' },
        ADMIN,
      );

      expect(repository.update).not.toHaveBeenCalled();
      expect(output.id).toBe(ID);
    });

    it('sin leer_sensible la respuesta no trae las claves sensibles', async () => {
      const { useCase } = makeUseCase();

      const output = await useCase.execute(
        ID,
        { phone: '912345678' },
        ANALISTA,
      );

      expect(output).not.toHaveProperty('hasChildrenUnder18');
      expect(output).not.toHaveProperty('essaludLifeInsurance');
    });
  });

  describe('documento', () => {
    it('si no cambia, no busca duplicados', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { documentNumber: '40506070' }, ADMIN);

      expect(repository.findByDocument).not.toHaveBeenCalled();
    });

    it('el de otro colaborador: 409 y no escribe', async () => {
      const repository = makeRepository({
        byDocument: otro({ documentNumber: '11112222' }),
      });
      const { useCase } = makeUseCase(repository);

      await expect(
        useCase.execute(ID, { documentNumber: '11112222' }, ADMIN),
      ).rejects.toBeInstanceOf(DuplicateDocumentError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('uno libre: lo busca y escribe', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { documentNumber: '11112222' }, ADMIN);

      expect(repository.findByDocument).toHaveBeenCalledWith('DNI', '11112222');
      expect(repository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('código de empleado', () => {
    it('si no cambia, no busca duplicados', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { employeeCode: 'EMP-001' }, ADMIN);

      expect(repository.findByEmployeeCode).not.toHaveBeenCalled();
    });

    it('el de otro colaborador: 409 y no escribe', async () => {
      const repository = makeRepository({
        byCode: otro({ employeeCode: 'EMP-002' }),
      });
      const { useCase } = makeUseCase(repository);

      await expect(
        useCase.execute(ID, { employeeCode: 'EMP-002' }, ADMIN),
      ).rejects.toBeInstanceOf(DuplicateEmployeeCodeError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('borrarlo con null no consulta duplicados', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { employeeCode: null }, ADMIN);

      expect(repository.findByEmployeeCode).not.toHaveBeenCalled();
      expect(repository.update.mock.calls[0]?.[1]).toEqual({
        employeeCode: null,
      });
    });
  });

  describe('correo (US-020c)', () => {
    it('el mismo en otras mayúsculas no consulta duplicados ni escribe', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(
        ID,
        { corporateEmail: 'MARIA.QUISPE@EMPRESA.PE' },
        ADMIN,
      );

      expect(repository.findByCorporateEmail).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('el de otro colaborador: 409 y no escribe', async () => {
      const repository = makeRepository({
        byCorporateEmail: otro({ corporateEmail: 'otra.persona@empresa.pe' }),
      });
      const { useCase } = makeUseCase(repository);

      await expect(
        useCase.execute(
          ID,
          { corporateEmail: 'Otra.Persona@Empresa.PE' },
          ADMIN,
        ),
      ).rejects.toBeInstanceOf(DuplicateEmailError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('uno libre: lo busca normalizado y lo escribe normalizado', async () => {
      const { useCase, repository } = makeUseCase();

      await useCase.execute(ID, { corporateEmail: ' Nuevo@Empresa.PE' }, ADMIN);

      expect(repository.findByCorporateEmail).toHaveBeenCalledWith(
        'nuevo@empresa.pe',
      );
      // El patch que llega al repositorio, no solo la entidad.
      expect(repository.update.mock.calls[0]?.[1]).toEqual({
        corporateEmail: 'nuevo@empresa.pe',
      });
    });
  });

  describe('ubigeo', () => {
    it('uno nuevo que no existe en el catálogo: 422 y no escribe', async () => {
      const { useCase, repository } = makeUseCase(makeRepository(), false);

      await expect(
        useCase.execute(ID, { ubigeoId: '999999' }, ADMIN),
      ).rejects.toBeInstanceOf(UbigeoNotFoundError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('el mismo que ya tenía no se vuelve a consultar', async () => {
      const { useCase, ubigeos } = makeUseCase();

      await useCase.execute(
        ID,
        { ubigeoId: '150101', phone: '987654321' },
        ADMIN,
      );

      expect(ubigeos.exists).not.toHaveBeenCalled();
    });

    it('borrarlo con null no consulta el catálogo', async () => {
      const { useCase, repository, ubigeos } = makeUseCase();

      await useCase.execute(ID, { ubigeoId: null }, ADMIN);

      expect(ubigeos.exists).not.toHaveBeenCalled();
      expect(repository.update.mock.calls[0]?.[1]).toEqual({ ubigeoId: null });
    });
  });
});
