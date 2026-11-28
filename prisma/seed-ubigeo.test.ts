import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readUbigeoCsv, UBIGEO_CSV } from './seed-ubigeo';

/**
 * Distritos del directorio INEI 2026 (prisma/data/README.md). Si el INEI crea o
 * fusiona distritos, se actualiza el archivo y este número en el mismo PR.
 */
const DISTRITOS_INEI = 1892;

describe('catálogo de ubigeo INEI 2026', () => {
  const rows = readUbigeoCsv(UBIGEO_CSV);

  it(`trae los ${DISTRITOS_INEI} distritos del archivo fuente`, () => {
    expect(rows).toHaveLength(DISTRITOS_INEI);
  });

  it('todos los id tienen exactamente 6 dígitos y no se repiten', () => {
    expect(rows.every((row) => /^\d{6}$/.test(row.id))).toBe(true);
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });

  it('150101 es LIMA / LIMA / LIMA', () => {
    expect(rows.find((row) => row.id === '150101')).toEqual({
      id: '150101',
      department: 'LIMA',
      province: 'LIMA',
      district: 'LIMA',
    });
  });

  it('cubre los 25 departamentos y las 196 provincias', () => {
    expect(new Set(rows.map((row) => row.id.slice(0, 2))).size).toBe(25);
    expect(new Set(rows.map((row) => row.id.slice(0, 4))).size).toBe(196);
  });
});

describe('readUbigeoCsv', () => {
  const csv = (...lines: string[]) => {
    const file = join(mkdtempSync(join(tmpdir(), 'ubigeo-')), 'ubigeo.csv');
    writeFileSync(
      file,
      ['id,department,province,district', ...lines].join('\n'),
    );
    return file;
  };

  it('rechaza un ubigeo que no tiene 6 dígitos, indicando la línea', () => {
    expect(() => readUbigeoCsv(csv('15010,LIMA,LIMA,LIMA'))).toThrow(
      /:2: el ubigeo "15010" no tiene 6 dígitos/,
    );
  });

  it('rechaza un ubigeo repetido', () => {
    expect(() =>
      readUbigeoCsv(csv('150101,LIMA,LIMA,LIMA', '150101,LIMA,LIMA,LIMA')),
    ).toThrow(/:3: el ubigeo 150101 está repetido/);
  });

  it('rechaza una fila sin las 4 columnas', () => {
    expect(() => readUbigeoCsv(csv('150101,LIMA,LIMA'))).toThrow(
      /:2: se esperaban 4 columnas/,
    );
  });
});
