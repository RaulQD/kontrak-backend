// domain/full-name.ts
import type { EmployeeProps } from './entities/employee.entity';

type NameParts = Pick<
  EmployeeProps,
  'firstNames' | 'lastNameFather' | 'lastNameMother'
>;

/** Debe coincidir con la columna generada full_name (migración expand_employees). */
export const buildFullName = (p: NameParts): string =>
  `${p.firstNames} ${p.lastNameFather} ${p.lastNameMother}`;
