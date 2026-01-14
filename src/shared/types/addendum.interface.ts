import { ValidationError } from './employees.interface';

export interface AddendumData {
  division: string;
  worker: string;
  documentNumber: string;
  entryDate: Date | string;
  start: Date | string;
  end: Date | string;
  startAddendum: Date | string;
  endAddendum: Date | string;
  address: string;
  province: string;
  district: string;
  department: string;
  salary: number;
  salaryInWords: string;
}

export interface ValidateAddendumResult {
  employeesAddendum: AddendumData[];
  errors: ValidationError[];
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}
