// El dominio no importa Prisma: declara sus propios tipos y el mapper traduce.
export type DocumentType = 'DNI' | 'CE' | 'PASAPORTE' | 'PTP';

export type EmployeeStatus =
  | 'ACTIVO'
  | 'CESADO'
  | 'SUSPENDIDO'
  | 'VACACIONES'
  | 'SUBSIDIADO';

export type Sex = 'MASCULINO' | 'FEMENINO';

export type MaritalStatus =
  | 'SOLTERO'
  | 'CASADO'
  | 'DIVORCIADO'
  | 'CONVIVIENTE'
  | 'VIUDO';

/**
 * Campos de la ficha que un PATCH puede tocar. Los nombres coinciden con
 * `EmployeeProps`: si divergen, `withPatch` ignora el campo en silencio.
 *
 * Clave ausente = no tocar. `null` = poner NULL (solo en los campos nullable).
 * Fuera a propósito: `id`, `createdAt`, `deletedAt`, y `status` /
 * `terminationDate`, que solo cambia el cese (US-022).
 */
export interface EmployeeUpdatePatch {
  employeeCode?: string | null;
  documentType?: DocumentType;
  documentNumber?: string;
  firstNames?: string;
  lastNameFather?: string;
  lastNameMother?: string;
  sex?: Sex | null;
  birthDate?: Date | null;
  maritalStatus?: MaritalStatus | null;
  nationality?: string;
  corporateEmail?: string;
  personalEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  ubigeoId?: string | null;
  hireDate?: Date;
  hasChildrenUnder18?: boolean;
  essaludLifeInsurance?: boolean;
  photoUrl?: string | null;
}

export interface EmployeeFilters {
  status?: EmployeeStatus;
  /** Coincidencia parcial sobre nombre completo o número de documento. */
  search?: string;
  page: number;
  limit: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
/** Quién ejecuta el caso de uso. Lo arma el controlador desde req.auth. */
export interface ActorContext {
  userId: string;
  permissions: readonly string[];
}
