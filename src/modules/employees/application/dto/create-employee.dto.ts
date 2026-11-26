import { NewEmployeeProps } from '../../domain/entities/employee.entity';
import { DocumentType, MaritalStatus, Sex } from '../../domain/types';

/**
 * Lo que llega para dar de alta, ya validado y normalizado por el schema.
 * `| undefined` en los opcionales porque así los infiere Zod y el proyecto
 * usa exactOptionalPropertyTypes.
 */
export interface CreateEmployeeInput {
  documentType: DocumentType;
  documentNumber: string;
  firstNames: string;
  lastNameFather: string;
  lastNameMother: string;
  hireDate: Date;
  email: string;
  employeeCode?: string | undefined;
  sex?: Sex | undefined;
  birthDate?: Date | undefined;
  maritalStatus?: MaritalStatus | undefined;
  nationality?: string | undefined;
  personalEmail?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  ubigeoId?: string | undefined;
  hasChildrenUnder18?: boolean | undefined;
  essaludLifeInsurance?: boolean | undefined;
  photoUrl?: string | undefined;
}
const DEFAULT_NATIONALITY = 'PERUANA';

/** Completa los opcionales con los valores por defecto del negocio. */
export const toNewEmployeeProps = (
  input: CreateEmployeeInput,
): NewEmployeeProps => ({
  employeeCode: input.employeeCode ?? null,
  documentType: input.documentType,
  documentNumber: input.documentNumber,
  firstNames: input.firstNames,
  lastNameFather: input.lastNameFather,
  lastNameMother: input.lastNameMother,
  sex: input.sex ?? null,
  birthDate: input.birthDate ?? null,
  maritalStatus: input.maritalStatus ?? null,
  nationality: input.nationality ?? DEFAULT_NATIONALITY,
  email: input.email,
  personalEmail: input.personalEmail ?? null,
  phone: input.phone ?? null,
  address: input.address ?? null,
  ubigeoId: input.ubigeoId ?? null,
  hireDate: input.hireDate,
  hasChildrenUnder18: input.hasChildrenUnder18 ?? false,
  essaludLifeInsurance: input.essaludLifeInsurance ?? false,
  photoUrl: input.photoUrl ?? null,
});
