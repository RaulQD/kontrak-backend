import type { EmployeeUpdatePatch } from '../../domain/types';

/**
 * Lo que llega en el PATCH, ya validado por el schema.
 *
 * Se deriva de EmployeeUpdatePatch para no repetir los 19 campos: si el
 * dominio agrega uno, aparece aquí solo. `| undefined` en cada campo por lo
 * mismo que en el alta: así lo infiere Zod con exactOptionalPropertyTypes.
 */
export type EmployeeUpdateInput = {
  [K in keyof EmployeeUpdatePatch]?: EmployeeUpdatePatch[K] | undefined;
} & {
  /**
   * No se cambian por PATCH: el cese es US-022. Están en el tipo solo para
   * que el caso de uso detecte el intento y responda 403 (D5).
   */
  status?: unknown;
  terminationDate?: unknown;
};

/**
 * Convierte la entrada en el patch del dominio: quita status/terminationDate
 * y las claves en undefined. En el patch, clave ausente = no tocar.
 */
export const toEmployeeUpdatePatch = ({
  status: _status,
  terminationDate: _terminationDate,
  ...fields
}: EmployeeUpdateInput): EmployeeUpdatePatch =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as EmployeeUpdatePatch;
