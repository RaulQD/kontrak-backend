import { describe, expect, it, vi } from 'vitest';
import type { ActorContext, EmployeeFilters, Page } from '../../domain/types';
import type {
  EmployeeView,
  IEmployeeRepository,
} from '../port/employee.repository.port';
import { ListEmployeesUseCase } from './list-employee.use-case';

const makeView = (
  id: string,
  over: Partial<EmployeeView> = {},
): EmployeeView => ({
  id,
  employeeCode: null,
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
  hireDate: new Date('2026-08-01'),
  terminationDate: null,
  status: 'ACTIVO',
  photoUrl: null,
  createdAt: new Date('2026-08-17T15:30:00.000Z'),
  updatedAt: new Date('2026-08-17T15:30:00.000Z'),
  deletedAt: null,
  ...over,
});

const FILTERS: EmployeeFilters = { page: 2, limit: 20, status: 'ACTIVO' };

const makeRepository = (page: Page<EmployeeView>) => {
  const list = vi.fn().mockResolvedValue(page);
  const repository = {
    findViewById: vi.fn(),
    list,
  } as unknown as IEmployeeRepository;
  return { repository, list };
};

const MANAGER: ActorContext = {
  userId: 'user-1',
  permissions: ['colaborador:leer'],
};
const ADMIN: ActorContext = {
  userId: 'user-2',
  permissions: ['colaborador:leer', 'colaborador:leer_sensible'],
};

describe('ListEmployeesUseCase', () => {
  it('pasa los filtros y, sin permiso, omite las claves sensibles en cada elemento', async () => {
    const { repository, list } = makeRepository({
      items: [makeView('a'), makeView('b')],
      total: 30,
      page: 2,
      limit: 20,
    });

    const result = await new ListEmployeesUseCase(repository).execute(
      FILTERS,
      MANAGER,
    );

    expect(list).toHaveBeenCalledWith(FILTERS, { includeSensitive: false });
    expect(result).toMatchObject({ total: 30, page: 2, limit: 20 });
    expect(result.items.map((item) => item.id)).toEqual(['a', 'b']);
    for (const item of result.items) {
      expect(item).not.toHaveProperty('hasChildrenUnder18');
      expect(item).not.toHaveProperty('essaludLifeInsurance');
    }
  });

  it('con colaborador:leer_sensible pide y devuelve las claves en cada elemento', async () => {
    const sensitive = { hasChildrenUnder18: true, essaludLifeInsurance: false };
    const { repository, list } = makeRepository({
      items: [makeView('a', sensitive)],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await new ListEmployeesUseCase(repository).execute(
      FILTERS,
      ADMIN,
    );

    expect(list).toHaveBeenCalledWith(FILTERS, { includeSensitive: true });
    expect(result.items[0]).toMatchObject(sensitive);
  });

  it('una página vacía sigue siendo una página, no un error', async () => {
    const { repository } = makeRepository({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    });

    const result = await new ListEmployeesUseCase(repository).execute(
      { page: 1, limit: 20, search: 'zzz' },
      MANAGER,
    );

    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
  });
});
