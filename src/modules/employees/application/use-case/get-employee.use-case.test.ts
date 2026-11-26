import { describe, expect, it, vi } from 'vitest';
import { EmployeeNotFoundError } from '../../domain/errors/employee.error';
import type { ActorContext } from '../../domain/types';
import type {
  EmployeeView,
  IEmployeeRepository,
} from '../port/employee.repository.port';
import { GetEmployeeUseCase } from './get-employee.use-case';

const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';

const makeView = (over: Partial<EmployeeView> = {}): EmployeeView => ({
  id: ID,
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

const makeRepository = (view: EmployeeView | null) => {
  const findViewById = vi.fn().mockResolvedValue(view);
  const repository = {
    findViewById,
    list: vi.fn(),
  } as unknown as IEmployeeRepository;
  return { repository, findViewById };
};

const ANALYST: ActorContext = {
  userId: 'user-1',
  permissions: ['colaborador:leer'],
};
const ADMIN: ActorContext = {
  userId: 'user-2',
  permissions: ['colaborador:leer', 'colaborador:leer_sensible'],
};

describe('GetEmployeeUseCase', () => {
  it('sin colaborador:leer_sensible pide la vista sin los campos sensibles', async () => {
    const { repository, findViewById } = makeRepository(makeView());

    const output = await new GetEmployeeUseCase(repository).execute(
      ID,
      ANALYST,
    );

    expect(findViewById).toHaveBeenCalledWith(ID, { includeSensitive: false });
    expect(output).not.toHaveProperty('hasChildrenUnder18');
    expect(output).not.toHaveProperty('essaludLifeInsurance');
  });

  it('con colaborador:leer_sensible los pide y los devuelve', async () => {
    const { repository, findViewById } = makeRepository(
      makeView({ hasChildrenUnder18: true, essaludLifeInsurance: true }),
    );

    const output = await new GetEmployeeUseCase(repository).execute(ID, ADMIN);

    expect(findViewById).toHaveBeenCalledWith(ID, { includeSensitive: true });
    expect(output).toMatchObject({
      hasChildrenUnder18: true,
      essaludLifeInsurance: true,
    });
  });

  it('lanza EmployeeNotFoundError si no existe o está anulado', async () => {
    const { repository } = makeRepository(null);

    await expect(
      new GetEmployeeUseCase(repository).execute(ID, ANALYST),
    ).rejects.toBeInstanceOf(EmployeeNotFoundError);
  });
});
