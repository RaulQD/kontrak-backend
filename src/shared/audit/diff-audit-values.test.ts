import { describe, expect, it } from 'vitest';
import { diffAuditValues } from './diff-audit-values';

describe('diffAuditValues', () => {
  it('devuelve solo los campos que cambiaron', () => {
    const antes = { nombres: 'Ana', cargo: 'Analista', sueldo: 3000 };
    const despues = { nombres: 'Ana', cargo: 'Jefa', sueldo: 4500 };

    expect(diffAuditValues(antes, despues)).toEqual({
      oldValues: { cargo: 'Analista', sueldo: 3000 },
      newValues: { cargo: 'Jefa', sueldo: 4500 },
    });
  });

  it('devuelve null si no cambió nada', () => {
    const snapshot = { nombres: 'Ana', activo: true, cese: null };

    expect(diffAuditValues(snapshot, { ...snapshot })).toBeNull();
  });

  it('compara las fechas por su valor, no por referencia', () => {
    const antes = { ingreso: new Date('2026-01-15T00:00:00.000Z') };
    const mismaFecha = { ingreso: new Date('2026-01-15T00:00:00.000Z') };

    expect(diffAuditValues(antes, mismaFecha)).toBeNull();
  });

  it('guarda las fechas como texto ISO para que quepan en JSONB', () => {
    const antes = { ingreso: new Date('2026-01-15T00:00:00.000Z') };
    const despues = { ingreso: new Date('2026-02-01T00:00:00.000Z') };

    expect(diffAuditValues(antes, despues)).toEqual({
      oldValues: { ingreso: '2026-01-15T00:00:00.000Z' },
      newValues: { ingreso: '2026-02-01T00:00:00.000Z' },
    });
  });

  it('trata undefined y null como el mismo valor', () => {
    expect(diffAuditValues({ cese: undefined }, { cese: null })).toBeNull();
  });

  it('cuenta como cambio una clave que solo existe en un lado', () => {
    expect(diffAuditValues({}, { correo: 'ana@apparka.pe' })).toEqual({
      oldValues: { correo: null },
      newValues: { correo: 'ana@apparka.pe' },
    });
    expect(diffAuditValues({ correo: 'ana@apparka.pe' }, {})).toEqual({
      oldValues: { correo: 'ana@apparka.pe' },
      newValues: { correo: null },
    });
  });

  it('distingue un número de su versión en texto', () => {
    expect(diffAuditValues({ hijos: 1 }, { hijos: '1' })).toEqual({
      oldValues: { hijos: 1 },
      newValues: { hijos: '1' },
    });
  });
});
