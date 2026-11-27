import { describe, expect, it } from 'vitest';
import { Prisma } from '../../../../generated/prisma/client';
import { isRecordNotFound, violatedUniqueIndex } from './prisma-error';

/** Un P2002 con la forma que arma @prisma/adapter-pg. */
const p2002 = (originalMessage: string) =>
  new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: 'test',
    meta: {
      modelName: 'Employee',
      driverAdapterError: {
        cause: { originalCode: '23505', originalMessage },
      },
    },
  });

describe('violatedUniqueIndex', () => {
  it.each([
    'ux_employees_doc',
    'ux_employees_code',
    'ux_employees_corporate_email',
  ] as const)('reconoce %s con el mensaje de Postgres en inglés', (indice) => {
    const error = p2002(
      `duplicate key value violates unique constraint "${indice}"`,
    );

    expect(violatedUniqueIndex(error)).toBe(indice);
  });

  it('lo reconoce también con lc_messages en español («»)', () => {
    const error = p2002(
      'llave duplicada viola restricción de unicidad «ux_employees_corporate_email»',
    );

    expect(violatedUniqueIndex(error)).toBe('ux_employees_corporate_email');
  });

  it('no confunde un índice con otro que empieza igual', () => {
    const error = p2002(
      'duplicate key value violates unique constraint "ux_employees_doc_old"',
    );

    expect(violatedUniqueIndex(error)).toBeNull();
  });

  it('un P2002 de otro índice devuelve null', () => {
    const error = p2002(
      'duplicate key value violates unique constraint "ux_users_email"',
    );

    expect(violatedUniqueIndex(error)).toBeNull();
  });

  it('un error que no es P2002 devuelve null', () => {
    const p2025 = new Prisma.PrismaClientKnownRequestError('Not found', {
      code: 'P2025',
      clientVersion: 'test',
    });

    expect(violatedUniqueIndex(p2025)).toBeNull();
    expect(violatedUniqueIndex(new Error('otro'))).toBeNull();
  });
});

describe('isRecordNotFound', () => {
  it('es true solo para P2025', () => {
    const p2025 = new Prisma.PrismaClientKnownRequestError('Not found', {
      code: 'P2025',
      clientVersion: 'test',
    });

    expect(isRecordNotFound(p2025)).toBe(true);
    expect(isRecordNotFound(p2002('x'))).toBe(false);
  });
});
