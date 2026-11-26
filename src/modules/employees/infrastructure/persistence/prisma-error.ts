import { Prisma } from '../../../../generated/prisma/client';

type DriverAdapterMeta = {
  driverAdapterError?: { cause?: { constraint?: { fields?: string[] } } };
};

/**
 * Columnas del índice único que se violó, o null si el error no es un P2002.
 * Con el adaptador pg, Prisma no llena `meta.target`: los campos vienen en
 * `meta.driverAdapterError.cause.constraint.fields` (en snake_case).
 */
export const uniqueViolationFields = (error: unknown): string[] | null => {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002'
  ) {
    return null;
  }
  const meta = error.meta as DriverAdapterMeta | undefined;
  return meta?.driverAdapterError?.cause?.constraint?.fields ?? [];
};

/** P2025: el update no encontró la fila (no existe o ya estaba anulada). */
export const isRecordNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2025';
