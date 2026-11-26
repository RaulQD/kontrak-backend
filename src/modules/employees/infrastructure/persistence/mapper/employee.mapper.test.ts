import { describe, expect, it } from 'vitest';
import type { EmployeeRow } from '../employee.select';
import { EmployeeMapper } from './employee.mapper';

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
  email: 'maria.quispe@apparka.pe',
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

    expect(EmployeeMapper.toView(row)).toEqual(row);
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
