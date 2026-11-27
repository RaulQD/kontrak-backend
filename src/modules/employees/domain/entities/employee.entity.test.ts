import { describe, expect, it } from 'vitest';
import { Employee, NewEmployeeProps } from './employee.entity';
import {
  EmployeeNotFoundError,
  InvalidEmployeeDataError,
} from '../errors/employee.error';

const NOW = new Date('2026-11-16T12:00:00.000Z');
const ID = '7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10';

const makeProps = (over: Partial<NewEmployeeProps> = {}): NewEmployeeProps => ({
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
  corporateEmail: 'maria.quispe@empresa.pe',
  personalEmail: null,
  phone: '999111222',
  address: 'AV. AREQUIPA 123',
  ubigeoId: null,
  hireDate: new Date('2026-08-17'),
  hasChildrenUnder18: false,
  essaludLifeInsurance: false,
  photoUrl: null,
  ...over,
});

const makeEmployee = (over: Partial<NewEmployeeProps> = {}): Employee =>
  Employee.create(makeProps(over), ID, NOW);

describe('Employee', () => {
  describe('create', () => {
    it('nace ACTIVO, sin fecha de cese y sin anular', () => {
      const employee = makeEmployee();

      expect(employee.status).toBe('ACTIVO');
      expect(employee.terminationDate).toBeNull();
      expect(employee.isDeleted()).toBe(false);
    });

    it('rechaza un DNI que no tiene 8 dígitos', () => {
      expect(() => makeEmployee({ documentNumber: '1234567' })).toThrow(
        InvalidEmployeeDataError,
      );
    });

    it('rechaza un número de documento más largo que la columna (15)', () => {
      expect(() =>
        makeEmployee({ documentType: 'CE', documentNumber: 'A'.repeat(16) }),
      ).toThrow(InvalidEmployeeDataError);
    });

    it('rechaza un ubigeo que no tiene 6 dígitos', () => {
      expect(() => makeEmployee({ ubigeoId: '15010' })).toThrow(
        InvalidEmployeeDataError,
      );
    });
  });

  describe('correo corporativo (US-020c)', () => {
    it('se guarda sin espacios y en minúsculas', () => {
      expect(
        makeEmployee({ corporateEmail: '  Maria.Quispe@Empresa.PE ' })
          .corporateEmail,
      ).toBe('maria.quispe@empresa.pe');
    });

    it('es obligatorio: uno vacío o de solo espacios se rechaza', () => {
      expect(() => makeEmployee({ corporateEmail: '   ' })).toThrow(
        'El correo corporativo es obligatorio',
      );
    });

    it('withPatch también lo normaliza', () => {
      const editado = makeEmployee().withPatch({
        corporateEmail: ' Otro.Correo@Empresa.PE',
      });

      expect(editado.corporateEmail).toBe('otro.correo@empresa.pe');
    });
  });

  describe('withPatch', () => {
    it('cambia los nombres con las mismas claves que usa la entidad', () => {
      const patched = makeEmployee().withPatch({
        firstNames: 'ANA',
        lastNameFather: 'MAMANI',
      });

      expect(patched.firstNames).toBe('ANA');
      expect(patched.lastNameFather).toBe('MAMANI');
      expect(patched.lastNameMother).toBe('ROJAS');
    });

    it('solo cambia los campos enviados', () => {
      const patched = makeEmployee().withPatch({ phone: '987654321' });

      expect(patched.phone).toBe('987654321');
      expect(patched.address).toBe('AV. AREQUIPA 123');
      expect(patched.id).toBe(ID);
    });

    it('pone NULL cuando el campo llega en null', () => {
      const patched = makeEmployee().withPatch({ phone: null });

      expect(patched.phone).toBeNull();
    });

    it('no pisa el valor actual cuando la clave llega en undefined', () => {
      const patch = { phone: undefined } as unknown as { phone: string };

      const patched = makeEmployee().withPatch(patch);

      expect(patched.phone).toBe('999111222');
    });

    it('valida las invariantes sobre el resultado', () => {
      expect(() => makeEmployee().withPatch({ documentNumber: '12' })).toThrow(
        InvalidEmployeeDataError,
      );
    });

    it('no modifica la instancia original', () => {
      const original = makeEmployee();

      original.withPatch({ firstNames: 'ANA' });

      expect(original.firstNames).toBe('MARIA ELENA');
    });
  });

  describe('terminate', () => {
    it('deja al colaborador CESADO con su fecha de cese', () => {
      const terminated = makeEmployee().terminate(new Date('2026-10-31'));

      expect(terminated.status).toBe('CESADO');
      expect(terminated.terminationDate).toEqual(new Date('2026-10-31'));
    });

    it('rechaza una fecha de cese anterior al ingreso', () => {
      expect(() => makeEmployee().terminate(new Date('2026-08-01'))).toThrow(
        InvalidEmployeeDataError,
      );
    });
  });

  describe('markDelete', () => {
    it('anula sin tocar el estado ni la fecha de cese', () => {
      const deleted = makeEmployee().markDelete(NOW);

      expect(deleted.isDeleted()).toBe(true);
      expect(deleted.status).toBe('ACTIVO');
      expect(deleted.terminationDate).toBeNull();
    });
  });

  describe('fullName', () => {
    it('arma el nombre completo con la fórmula de la columna full_name', () => {
      expect(makeEmployee().fullName()).toBe('MARIA ELENA QUISPE ROJAS');
    });
  });
});

describe('EmployeeNotFoundError', () => {
  it('arma el mensaje en español, sin sufijo en inglés, y responde 404', () => {
    const error = new EmployeeNotFoundError(ID);

    expect(error.message).toBe(`No se encontró un colaborador con el id ${ID}`);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });
});
