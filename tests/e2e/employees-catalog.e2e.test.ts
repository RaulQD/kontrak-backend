import { describe, it, expect, afterAll } from 'vitest';
import { prisma } from '../../src/platform/database/prisma';

// Estos objetos viven en las migraciones pero no en schema.prisma, porque
// Prisma no sabe expresarlos. Un `prisma db push` los borraría sin avisar:
// este test lo detecta (docs/scrum/04 §3.3).
describe('Objetos SQL de employees fuera de schema.prisma', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  const indexdef = async (name: string): Promise<string | undefined> => {
    const filas = await prisma.$queryRaw<{ indexdef: string }[]>`
      SELECT indexdef FROM pg_indexes
      WHERE tablename = 'employees' AND indexname = ${name}`;
    return filas[0]?.indexdef;
  };

  it('ux_employees_doc es único y parcial: permite reusar el documento de un anulado', async () => {
    const def = await indexdef('ux_employees_doc');

    expect(def).toMatch(/^CREATE UNIQUE INDEX/);
    expect(def).toContain('(document_type, document_number)');
    expect(def).toContain('WHERE (deleted_at IS NULL)');
  });

  it('ux_employees_code es único y parcial', async () => {
    const def = await indexdef('ux_employees_code');

    expect(def).toMatch(/^CREATE UNIQUE INDEX/);
    expect(def).toContain('(employee_code)');
    expect(def).toContain('WHERE (deleted_at IS NULL)');
  });

  it('ux_employees_email es único, parcial y sin distinguir mayúsculas (US-020c)', async () => {
    const def = await indexdef('ux_employees_corporate_email');

    expect(def).toMatch(/^CREATE UNIQUE INDEX/);
    expect(def).toContain('lower((corporate_email)::text)');
    expect(def).toContain('WHERE (deleted_at IS NULL)');
  });

  it('existen los CHECK de formato de DNI y de rango de la fecha de cese', async () => {
    const filas = await prisma.$queryRaw<{ conname: string }[]>`
      SELECT conname FROM pg_constraint
      WHERE conrelid = 'employees'::regclass AND contype = 'c'`;

    expect(filas.map((fila) => fila.conname)).toEqual(
      expect.arrayContaining([
        'ck_employees_dni_format',
        'ck_employees_termination_range',
      ]),
    );
  });

  it('full_name es una columna generada STORED', async () => {
    const filas = await prisma.$queryRaw<{ attgenerated: string }[]>`
      SELECT attgenerated::text AS attgenerated FROM pg_attribute
      WHERE attrelid = 'employees'::regclass AND attname = 'full_name'`;

    expect(filas[0]?.attgenerated).toBe('s');
  });
});
