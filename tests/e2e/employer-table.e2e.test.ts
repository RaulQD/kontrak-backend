import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '../../src/platform/database/prisma';

// Columnas obligatorias con valores válidos; solo cambia el id de cada intento.
const insertar = (id: string) =>
  prisma.$executeRawUnsafe(`
    INSERT INTO "employer" (${id ? '"id", ' : ''}"ruc", "legal_name", "address",
      "legal_rep_name", "legal_rep_doc_type", "legal_rep_doc_number")
    VALUES (${id ? `${id}, ` : ''}'20603381697', 'OTRA', 'OTRA', 'OTRA', 'DNI', '12345678')`);

describe('US-031: la tabla employer tiene una sola fila', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('el seed dejó la fila 1 con los datos de EMPLOYER', async () => {
    const filas = await prisma.employer.findMany();
    expect(filas).toHaveLength(1);
    expect(filas[0]).toMatchObject({ id: 1, ruc: '20603381697' });
  });

  // Se comprueba el código SQLSTATE y no el texto, que cambia con lc_messages.
  it('la base rechaza una segunda fila: CHECK employer_single_row (23514)', async () => {
    await expect(insertar('2')).rejects.toThrow(/23514/);
  });

  it('y rechaza repetir la fila 1: clave primaria (23505)', async () => {
    await expect(insertar('')).rejects.toThrow(/23505/);
  });
});
