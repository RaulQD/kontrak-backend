import { EmployeeData, ValidationError } from './employees.types';

export interface ContractProcessingResult {
  sessionPath: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  generatedPDFs: number;
  pdfResults: PDFResult[];
  errors: PDFGenerationError[];
  summary: Record<string, number>;
  validationErrors?: ValidationError[];
  employees: EmployeeData[]; // NUEVO
  sessionId: string; // NUEVO (extraído de sessionPath)
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
