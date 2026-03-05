export type AddendumType =
  | 'POR INICIO O INCREMENTO DE ACTIVIDAD'
  | 'DE SUPLENCIA';
export interface AddendumData {
  division: string;
  worker: string;
  documentNumber: string;
  contractType: AddendumType;
  entryDate: Date | string;
  start?: Date | string;
  end: Date | string;
  startAddendum: Date | string;
  endAddendum: Date | string;
  position: string;
  address: string;
  province: string;
  district: string;
  department: string;
  salary: number;
  salaryInWords: string;
  subDivisionOrParking: string;
  replacementFor?: string;
  unit?: string;
}

export interface ValidateAddendumResult {
  employeesAddendum: AddendumData[];
  totalRecords: number;
}
