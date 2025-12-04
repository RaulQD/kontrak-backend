import { AppError } from '../utils/app-error';

export type ContractType = 'PLANILLA' | 'SUBSIDIO' | 'PART TIME' | 'APE';

export interface EmployeeData {
  name: string;
  lastNameFather: string;
  lastNameMother: string;
  dni: string;
  email: string;
  province: string;
  district: string;
  department: string;
  address: string;
  salary?: number;
  salaryInWords?: string;
  entryDate?: Date | string;
  position: string;
  // Campos específicos de SUBSIDIO
  replacementFor?: string;
  reasonForSubstitution?: string;
  contractType: ContractType;
}

export interface AddressData {
  province: string;
  district: string;
  department: string;
  address: string;
}

export interface ContractData {
  emplooyeeDni: string;
  fileName: string;
  buffer: Buffer;
  contractType: ContractType;
}

export interface ValidationError {
  error: AppError;
  row: number;
  field: string;
}
export interface ValidationResult {
  isValid: boolean;
  employees: EmployeeData[];
  errors: ValidationError[];
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}
