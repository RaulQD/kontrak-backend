import { EmployeeData } from './employees.interface';

export interface excelProcessingResult {
  totalRecords: number;
  employees: EmployeeData[]; // NUEVO
}

export interface PDFResult {
  dni: string;
  filename: string;
  contractType: string;
  size: number;
  path: string;
}

export interface PDFGenerationError {
  dni: string;
  error: string;
}
export interface PDFPreviewBase64 {
  dni: string;
  fileName: string;
  pdfBase64?: string;
}
