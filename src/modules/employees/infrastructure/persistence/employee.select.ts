import type { Prisma } from '../../../../generated/prisma/client';

// Lista BLANCA: una columna nueva en la tabla no viaja hasta que alguien la agregue aquí.
export const PUBLIC_SELECT = {
  id: true,
  employeeCode: true,
  documentType: true,
  documentNumber: true,
  firstNames: true,
  lastNameFather: true,
  lastNameMother: true,
  sex: true,
  birthDate: true,
  maritalStatus: true,
  nationality: true,
  corporateEmail: true,
  personalEmail: true,
  phone: true,
  address: true,
  ubigeoId: true,
  hireDate: true,
  terminationDate: true,
  status: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const satisfies Prisma.EmployeeSelect;

// Solo se piden si el actor tiene colaborador:leer_sensible (D2 de docs/scrum/04).
export const SENSITIVE_SELECT = {
  hasChildrenUnder18: true,
  essaludLifeInsurance: true,
} as const satisfies Prisma.EmployeeSelect;

export const FULL_SELECT = {
  ...PUBLIC_SELECT,
  ...SENSITIVE_SELECT,
} as const satisfies Prisma.EmployeeSelect;

type PublicRow = Prisma.EmployeeGetPayload<{ select: typeof PUBLIC_SELECT }>;
type SensitiveRow = Prisma.EmployeeGetPayload<{
  select: typeof SENSITIVE_SELECT;
}>;

/** Fila leída: lo público siempre; lo sensible solo si se seleccionó. */
export type EmployeeRow = PublicRow & Partial<SensitiveRow>;

export type EmployeeFullRow = Prisma.EmployeeGetPayload<{
  select: typeof FULL_SELECT;
}>;
