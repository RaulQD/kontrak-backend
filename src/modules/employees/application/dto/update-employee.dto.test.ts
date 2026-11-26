import { describe, expect, expectTypeOf, it } from 'vitest';
import type { EmployeeUpdatePatch } from '../../domain/types';
import { toEmployeeUpdatePatch } from './update-employee.dto';

/**
 * La edición no pasa por un `toUpdate` del mapper: el repositorio escribe el
 * patch tal cual. Por eso la garantía de "nunca se escribe fullName" vive en el
 * tipo del patch y en esta conversión.
 */
describe('El patch de la edición', () => {
  it('el tipo no admite columnas que la app no escribe ni campos del cese', () => {
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('fullName');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('updatedAt');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('createdAt');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('deletedAt');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('id');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('status');
    expectTypeOf<EmployeeUpdatePatch>().not.toHaveProperty('terminationDate');
  });
});

describe('toEmployeeUpdatePatch', () => {
  it('deja solo los campos enviados: una clave en undefined es "no tocar"', () => {
    expect(
      toEmployeeUpdatePatch({ phone: '987654321', address: undefined }),
    ).toEqual({ phone: '987654321' });
  });

  it('conserva null, que significa borrar el valor', () => {
    expect(toEmployeeUpdatePatch({ address: null, ubigeoId: null })).toEqual({
      address: null,
      ubigeoId: null,
    });
  });

  it('quita status y terminationDate: el cese no se escribe por esta vía', () => {
    const patch = toEmployeeUpdatePatch({
      phone: '987654321',
      status: 'CESADO',
      terminationDate: '2026-09-01',
    });

    expect(patch).toEqual({ phone: '987654321' });
  });

  it('un cuerpo sin campos da un patch vacío', () => {
    expect(toEmployeeUpdatePatch({})).toEqual({});
  });
});
