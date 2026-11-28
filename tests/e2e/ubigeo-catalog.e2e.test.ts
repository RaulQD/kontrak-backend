import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '../../src/platform/database/prisma';
import { readUbigeoCsv, seedUbigeo } from '../../prisma/seed-ubigeo';

const ids = readUbigeoCsv().map((row) => row.id);
const enCatalogo = () => prisma.ubigeo.count({ where: { id: { in: ids } } });

describe('US-004d: catálogo de ubigeo sembrado', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('el global-setup cargó todos los distritos del archivo', async () => {
    expect(await enCatalogo()).toBe(ids.length);
  });

  it('150101 es LIMA / LIMA / LIMA', async () => {
    expect(await prisma.ubigeo.findUnique({ where: { id: '150101' } })).toEqual(
      {
        id: '150101',
        department: 'LIMA',
        province: 'LIMA',
        district: 'LIMA',
      },
    );
  });

  it('volver a sembrar no duplica ni falla, y corrige un nombre alterado', async () => {
    await prisma.ubigeo.update({
      where: { id: '150101' },
      data: { district: 'ALTERADO' },
    });

    await expect(seedUbigeo(prisma)).resolves.toBe(ids.length);

    expect(await enCatalogo()).toBe(ids.length);
    const lima = await prisma.ubigeo.findUniqueOrThrow({
      where: { id: '150101' },
    });
    expect(lima.district).toBe('LIMA');
  });
});
