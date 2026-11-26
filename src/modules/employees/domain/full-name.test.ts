import { describe, expect, it } from 'vitest';
import { buildFullName } from './full-name';

// La e2e de US-020a compara este resultado con la columna generada full_name
// de Postgres; aquí se fija la fórmula sin base de datos.
describe('buildFullName', () => {
  it('une nombres, apellido paterno y materno con un espacio', () => {
    expect(
      buildFullName({
        firstNames: 'MARIA ELENA',
        lastNameFather: 'QUISPE',
        lastNameMother: 'ROJAS',
      }),
    ).toBe('MARIA ELENA QUISPE ROJAS');
  });

  it('con el apellido materno vacío deja el espacio final, igual que la BD', () => {
    expect(
      buildFullName({
        firstNames: 'JOHN',
        lastNameFather: 'SMITH',
        lastNameMother: '',
      }),
    ).toBe('JOHN SMITH ');
  });
});
