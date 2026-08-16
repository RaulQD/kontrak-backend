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
