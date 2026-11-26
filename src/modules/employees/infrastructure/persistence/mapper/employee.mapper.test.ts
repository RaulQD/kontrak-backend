import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Employee,
  NewEmployeeProps,
} from '../../../domain/entities/employee.entity';
import type { EmployeeFullRow, EmployeeRow } from '../employee.select';
import { EmployeeMapper, EmployeeWriteData } from './employee.mapper';

const makeRow = (over: Partial<EmployeeRow> = {}): EmployeeRow => ({
  id: '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10',
  employeeCode: 'E-0001',
  documentType: 'DNI',
  documentNumber: '40506070',
  firstNames: 'MARIA ELENA',
  lastNameFather: 'QUISPE',
  lastNameMother: 'ROJAS',
  sex: 'FEMENINO',
  birthDate: new Date('1990-05-10'),
  maritalStatus: 'SOLTERO',
  nationality: 'PERUANA',
  corporateEmail: 'maria.quispe@apparka.pe',
  personalEmail: null,
  phone: '999111222',
  address: 'AV. AREQUIPA 123',
  ubigeoId: '150101',
  hireDate: new Date('2026-08-17'),
  terminationDate: null,
  status: 'ACTIVO',
  photoUrl: null,
  createdAt: new Date('2026-08-17T15:00:00.000Z'),
  updatedAt: new Date('2026-08-18T15:00:00.000Z'),
  deletedAt: null,
  ...over,
});

describe('EmployeeMapper.toView', () => {
  it('copia cada campo público tal cual, incluida una nacionalidad null', () => {
    const row = makeRow({ nationality: null });
    const { corporateEmail, ...resto } = row;

    // La columna es corporate_email; la vista la expone como `email` (US-020c).
    expect(EmployeeMapper.toView(row)).toEqual({
      ...resto,
      email: corporateEmail,
    });
  });

  it('si la fila no trae las columnas sensibles, la vista no tiene esas claves', () => {
    const view = EmployeeMapper.toView(makeRow());

    expect(view).not.toHaveProperty('hasChildrenUnder18');
    expect(view).not.toHaveProperty('essaludLifeInsurance');
  });

  it('si la fila las trae, las copia, también cuando valen false', () => {
    const view = EmployeeMapper.toView(
      makeRow({ hasChildrenUnder18: false, essaludLifeInsurance: true }),
    );

    expect(view.hasChildrenUnder18).toBe(false);
    expect(view.essaludLifeInsurance).toBe(true);
  });

  it('no agrega fullName: la vista no arrastra el string | null de la columna', () => {
    expect(EmployeeMapper.toView(makeRow())).not.toHaveProperty('fullName');
  });
});

// ── Escritura ───────────────────────────────────────────────────────────────

const PROPS: NewEmployeeProps = {
  employeeCode: 'E-0001',
  documentType: 'DNI',
  documentNumber: '40506070',
  firstNames: 'MARIA ELENA',
  lastNameFather: 'QUISPE',
  lastNameMother: 'ROJAS',
  sex: 'FEMENINO',
  birthDate: new Date('1990-05-10T00:00:00.000Z'),
  maritalStatus: 'SOLTERO',
  nationality: 'PERUANA',
  email: 'maria.quispe@apparka.pe',
  personalEmail: null,
  phone: '999111222',
  address: 'AV. AREQUIPA 123',
  ubigeoId: '150101',
  hireDate: new Date('2026-08-17T00:00:00.000Z'),
  hasChildrenUnder18: true,
  essaludLifeInsurance: false,
  photoUrl: null,
};
const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';
const CREATED_AT = new Date('2026-08-17T15:00:00.000Z');

/** Las 24 columnas que escribe la app: todas menos full_name y updated_at. */
const COLUMNAS_ESCRITAS = [
  'id',
  'employeeCode',
  'documentType',
  'documentNumber',
  'firstNames',
  'lastNameFather',
  'lastNameMother',
  'sex',
  'birthDate',
  'maritalStatus',
  'nationality',
  'corporateEmail',
  'personalEmail',
  'phone',
  'address',
  'ubigeoId',
  'hireDate',
  'terminationDate',
  'status',
  'hasChildrenUnder18',
  'essaludLifeInsurance',
  'photoUrl',
  'createdAt',
  'deletedAt',
];

describe('EmployeeMapper.toPersistence', () => {
  const data = EmployeeMapper.toPersistence(
    Employee.create(PROPS, ID, CREATED_AT),
  );

  it('no contiene fullName: es una columna generada y Postgres rechazaría el INSERT', () => {
    expect(data).not.toHaveProperty('fullName');
  });

  it('no contiene updatedAt: lo pone Prisma', () => {
    expect(data).not.toHaveProperty('updatedAt');
  });

  it('el tipo tampoco los admite, así que agregarlos no compila', () => {
    expectTypeOf<EmployeeWriteData>().not.toHaveProperty('fullName');
    expectTypeOf<EmployeeWriteData>().not.toHaveProperty('updatedAt');
  });

  it('escribe exactamente las columnas de la ficha, ni una más', () => {
    expect(Object.keys(data).sort()).toEqual([...COLUMNAS_ESCRITAS].sort());
  });

  it('copia los valores de la entidad, incluidos los null y lo que fija el alta', () => {
    const { email, ...resto } = PROPS;
    expect(data).toEqual({
      ...resto,
      corporateEmail: email,
      id: ID,
      status: 'ACTIVO',
      terminationDate: null,
      createdAt: CREATED_AT,
      deletedAt: null,
    });
  });
});

describe('EmployeeMapper.toEntity', () => {
  const fullRow = (over: Partial<EmployeeFullRow> = {}): EmployeeFullRow => ({
    ...makeRow(),
    hasChildrenUnder18: true,
    essaludLifeInsurance: false,
    ...over,
  });

  it('una nacionalidad null se lee como PERUANA', () => {
    expect(
      EmployeeMapper.toEntity(fullRow({ nationality: null })).nationality,
    ).toBe('PERUANA');
  });

  it('no valida: un dato legacy que hoy no pasaría no bloquea la lectura', () => {
    const employee = EmployeeMapper.toEntity(
      fullRow({ documentNumber: '1234567' }),
    );

    expect(employee.documentNumber).toBe('1234567');
  });

  it('ida y vuelta: toPersistence(toEntity(fila)) conserva cada columna escrita', () => {
    const row = fullRow();

    const data = EmployeeMapper.toPersistence(EmployeeMapper.toEntity(row));

    const { updatedAt: _updatedAt, ...columnas } = row;
    expect(data).toEqual(columnas);
  });
});
describe('EmployeeMapper.toUpdateData', () => {
  it('escribe el correo en corporateEmail, no en email (US-020c)', () => {
    expect(
      EmployeeMapper.toUpdateData({ email: 'ana@empresa.pe', phone: null }),
    ).toEqual({ corporateEmail: 'ana@empresa.pe', phone: null });
  });

  it('sin email en el patch no agrega corporateEmail', () => {
    expect(EmployeeMapper.toUpdateData({ phone: '999888777' })).toEqual({
      phone: '999888777',
    });
  });
});
