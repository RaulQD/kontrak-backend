import { Prisma } from '../../../../generated/prisma/client';

/** Índices únicos parciales de employees (viven en las migraciones, no en schema.prisma). */
const UNIQUE_INDEXES = [
  'ux_employees_doc',
  'ux_employees_code',
  'ux_employees_corporate_email',
] as const;
export type EmployeeUniqueIndex = (typeof UNIQUE_INDEXES)[number];

type DriverAdapterMeta = {
  driverAdapterError?: { cause?: { originalMessage?: string } };
};

/**
 * Qué índice único se violó, o null si el error no es un P2002 de employees.
 *
 * Se lee el nombre del índice en el mensaje original de Postgres, no los campos:
 * - con el adaptador pg, Prisma no llena `meta.target`;
 * - el adaptador saca los campos del detalle en inglés ("Key (...)"), así que
 *   con `lc_messages` en español llegan vacíos;
 * - en un índice de expresión como `lower(email)` llegan mal formados.
 * El nombre aparece entre comillas en inglés ("ux_…") y entre « » en español.
 */
export const violatedUniqueIndex = (
  error: unknown,
): EmployeeUniqueIndex | null => {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002'
  ) {
    return null;
  }
  const meta = error.meta as DriverAdapterMeta | undefined;
  const message = meta?.driverAdapterError?.cause?.originalMessage ?? '';
  return (
    UNIQUE_INDEXES.find((name) =>
      new RegExp(`["«]${name}["»]`).test(message),
    ) ?? null
  );
};

/** P2025: el update no encontró la fila (no existe o ya estaba anulada). */
export const isRecordNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2025';
