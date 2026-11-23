import { describe, expect, it } from 'vitest';
import { SENSITIVE_FIELDS } from '../../domain/sensitive-fields';
import {
  FULL_SELECT,
  PUBLIC_SELECT,
  SENSITIVE_SELECT,
} from './employee.select';

// Estas listas deciden qué columnas viajan en el SQL. Sin el permiso
// colaborador:leer_sensible el repositorio usa PUBLIC_SELECT (escenario 8).
describe('employee.select', () => {
  it('PUBLIC_SELECT no pide ninguna columna sensible', () => {
    for (const field of SENSITIVE_FIELDS) {
      expect(PUBLIC_SELECT).not.toHaveProperty(field);
    }
  });

  it('SENSITIVE_SELECT pide exactamente los campos sensibles del dominio', () => {
    expect(Object.keys(SENSITIVE_SELECT).sort()).toEqual(
      [...SENSITIVE_FIELDS].sort(),
    );
  });

  it('FULL_SELECT es lo público más lo sensible, nada más', () => {
    expect(FULL_SELECT).toEqual({ ...PUBLIC_SELECT, ...SENSITIVE_SELECT });
  });

  it('no lee la columna full_name: el nombre se calcula en el dominio', () => {
    expect(FULL_SELECT).not.toHaveProperty('fullName');
  });
});
