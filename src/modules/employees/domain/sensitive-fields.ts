import type { PermissionCode } from '../../../shared/constants/permissions';
import type { EmployeeProps } from './entities/employee.entity';

export const SENSITIVE_FIELDS = [
  'hasChildrenUnder18',
  'essaludLifeInsurance',
] as const satisfies readonly (keyof EmployeeProps)[];

export type SensitiveField = (typeof SENSITIVE_FIELDS)[number];

export const READ_SENSITIVE: PermissionCode = 'colaborador:leer_sensible';

export const canReadSensitive = (permissions: readonly string[]): boolean =>
  permissions.includes(READ_SENSITIVE);
