import {
  DocumentType,
  EmployeeStatus,
  MaritalStatus,
} from '../../../../generated/prisma/browser';
import { EmployeeView } from '../../application/port/employee.repository.port';
import { buildFullName } from '../../domain/full-name';
import { Sex } from '../../domain/types';

/**
 * Contrato público de la ficha. Lo usan el detalle, cada elemento del
 * listado y, en US-020b, las respuestas de POST y PATCH.
 * Se escribe campo por campo a propósito: una columna nueva en la BD no
 * llega a la API hasta que alguien la agregue aquí.
 */
export interface EmployeeOutput {
  id: string;
  employeeCode: string | null;
  documentType: DocumentType;
  documentNumber: string;
  firstNames: string;
  lastNameFather: string;
  lastNameMother: string;
  fullName: string;
  sex: Sex | null;
  birthDate: string | null; // YYYY-MM-DD
  maritalStatus: MaritalStatus | null;
  nationality: string | null;
  email: string | null;
  personalEmail: string | null;
  phone: string | null;
  address: string | null;
  ubigeoId: string | null;
  hireDate: string; // YYYY-MM-DD
  terminationDate: string | null; // YYYY-MM-DD
  status: EmployeeStatus;
  photoUrl: string | null;
  createdAt: string; // ISO con hora
  updatedAt: string; // ISO con hora
  deletedAt: string | null; // ISO con hora
  // Solo existen si el actor tiene colaborador:leer_sensible.
  hasChildrenUnder18?: boolean;
  essaludLifeInsurance?: boolean;
}
// Columnas @db.Date: sin hora, para que el front en Lima no muestre el día anterior.
const toDateOnly = (d: Date): string => d.toISOString().slice(0, 10);
const toDateOnlyOrNull = (d: Date | null): string | null =>
  d === null ? null : toDateOnly(d);

export function toEmployeeOutput(
  view: EmployeeView,
  canReadSensitive: boolean,
): EmployeeOutput {
  const output: EmployeeOutput = {
    id: view.id,
    employeeCode: view.employeeCode,
    documentType: view.documentType,
    documentNumber: view.documentNumber,
    firstNames: view.firstNames,
    lastNameFather: view.lastNameFather,
    lastNameMother: view.lastNameMother,
    fullName: buildFullName(view),
    sex: view.sex,
    birthDate: toDateOnlyOrNull(view.birthDate),
    maritalStatus: view.maritalStatus,
    nationality: view.nationality,
    email: view.email,
    personalEmail: view.personalEmail,
    phone: view.phone,
    address: view.address,
    ubigeoId: view.ubigeoId,
    hireDate: toDateOnly(view.hireDate),
    terminationDate: toDateOnlyOrNull(view.terminationDate),
    status: view.status,
    photoUrl: view.photoUrl,
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
    deletedAt: view.deletedAt?.toISOString() ?? null,
  };

  if (!canReadSensitive) return output; // las claves no existen

  if (
    view.hasChildrenUnder18 === undefined ||
    view.essaludLifeInsurance === undefined
  ) {
    throw new Error(
      'La lectura con permiso sensible no trajo los campos sensibles',
    );
  }
  output.hasChildrenUnder18 = view.hasChildrenUnder18;
  output.essaludLifeInsurance = view.essaludLifeInsurance;
  return output;
}
