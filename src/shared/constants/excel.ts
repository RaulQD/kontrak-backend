export const ALLOWED_EXCEL_MIMES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/excel',
  'application/x-excel',
  'application/x-msexcel',
  'text/csv',
  'application/csv',
  // Algunos clientes (Postman, navegadores en Windows, Blobs sin tipo) envían
  // el .xlsx como binario genérico; la extensión ya se valida por separado.
  'application/octet-stream',
];
export const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

export const MAP_SEX: Record<string, string> = {
  M: 'MASCULINO',
  m: 'MASCULINO',
  F: 'FEMENINO',
  f: 'FEMENINO',
};
