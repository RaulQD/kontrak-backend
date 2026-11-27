import { describe, expect, it } from 'vitest';
import type { EmployeeView } from '../port/employee.repository.port';
import { toEmployeeOutput } from './employee.dto';

const makeView = (over: Partial<EmployeeView> = {}): EmployeeView => ({
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
  corporateEmail: 'maria.quispe@empresa.pe',
  personalEmail: null,
  phone: '999111222',
  address: 'AV. AREQUIPA 123',
  ubigeoId: '150101',
  hireDate: new Date('2026-08-01'),
  terminationDate: null,
  status: 'ACTIVO',
  photoUrl: null,
  createdAt: new Date('2026-08-17T15:30:00.000Z'),
  updatedAt: new Date('2026-08-18T09:00:00.000Z'),
  deletedAt: null,
  ...over,
});

const SENSITIVE = { hasChildrenUnder18: true, essaludLifeInsurance: false };

describe('toEmployeeOutput', () => {
  it('formatea las columnas @db.Date como YYYY-MM-DD, sin correrse un día', () => {
    const output = toEmployeeOutput(
      makeView({ terminationDate: new Date('2026-12-31') }),
      false,
    );

    expect(output.hireDate).toBe('2026-08-01');
    expect(output.birthDate).toBe('1990-05-10');
    expect(output.terminationDate).toBe('2026-12-31');
  });

  it('deja en null las fechas que no existen', () => {
    const output = toEmployeeOutput(makeView({ birthDate: null }), false);

    expect(output.birthDate).toBeNull();
    expect(output.terminationDate).toBeNull();
  });

  it('createdAt y updatedAt salen en ISO con hora', () => {
    const output = toEmployeeOutput(makeView(), false);

    expect(output.createdAt).toBe('2026-08-17T15:30:00.000Z');
    expect(output.updatedAt).toBe('2026-08-18T09:00:00.000Z');
  });

  it('calcula fullName con la fórmula del dominio', () => {
    expect(toEmployeeOutput(makeView(), false).fullName).toBe(
      'MARIA ELENA QUISPE ROJAS',
    );
  });

  it('sin permiso omite las claves sensibles aunque la vista las traiga', () => {
    // Segunda barrera: aunque el repositorio se equivoque de select, no salen.
    const output = toEmployeeOutput(makeView(SENSITIVE), false);

    expect(output).not.toHaveProperty('hasChildrenUnder18');
    expect(output).not.toHaveProperty('essaludLifeInsurance');
    expect(JSON.stringify(output)).not.toMatch(
      /hasChildrenUnder18|essaludLifeInsurance/,
    );
  });

  it('con permiso incluye ambas claves con su valor, también false', () => {
    const output = toEmployeeOutput(makeView(SENSITIVE), true);

    expect(output.hasChildrenUnder18).toBe(true);
    expect(output.essaludLifeInsurance).toBe(false);
  });

  it('con permiso pero sin los campos en la vista falla, en vez de omitirlos en silencio', () => {
    expect(() => toEmployeeOutput(makeView(), true)).toThrow(
      'La lectura con permiso sensible no trajo los campos sensibles',
    );
  });
});
