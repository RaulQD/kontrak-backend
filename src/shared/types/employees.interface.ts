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
  salary: number;
  salaryInWords?: string;
  entryDate: Date | string;
  endDate: Date | string;
  sex?: string;
  position: string;
  subDivisionOrParking: string;
  division: string;
  sctr: string;
  birthDate?: Date | string;
  timeForCompany?: string;
  replacementFor?: string;
  reasonForSubstitution?: string;
  workingCondition?: string;
  probationaryPeriod?: string;
  contractType: ContractType;
}
export interface EmployeeWithStatus extends EmployeeData {
  pdfGenerated?: boolean;
  pdfPath?: string;
  errors?: string[];
  row?: number;
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
export interface SimpleValidationError {
  message: string;
  row: number;
  field: string;
}

export interface AppErrorContext {
  validationErrors?: SimpleValidationError[];
}
export interface ValidationResult {
  employees: EmployeeWithStatus[];
  totalRecords: number;
}
