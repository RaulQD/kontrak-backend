export const FIELD_LABELS: Record<string, string> = {
  // Campos base
  name: 'Nombre',
  lastNameFather: 'Apellido Paterno',
  lastNameMother: 'Apellido Materno',
  dni: 'DNI',
  salary: 'Salario',
  salaryInWords: 'Salario en Letras',
  entryDate: 'Fecha de Ingreso',
  endDate: 'Fecha de Término',
  subDivisionOrParking: 'Sub División / Playa',
  division: 'División',
  sctr: 'SCTR',
  position: 'Cargo',
  contractType: 'Tipo de Contrato',

  // Ubicación
  address: 'Dirección',
  province: 'Provincia',
  district: 'Distrito',
  department: 'Departamento',
  // Campos comunes
  email: 'Correo Electrónico',
  phone: 'Teléfono',
  birthDate: 'Fecha de Nacimiento',
  sex: 'Género',
  workingCondition: 'Condición Laboral',
  // Subsidio
  replacementFor: 'Suplencia de',
  reasonForSubstitution: 'Motivo de Suplencia',
  timeForCompany: 'Tiempo en Empresa',
  probationaryPeriod: 'Período de Prueba',
  // Addendum
  documentNumber: 'Número de Documento',
  worker: 'Trabajador',
  start: 'Inicio',
  end: 'Fin',
  startAddendum: 'Inicio Adenda',
  endAddendum: 'Fin Adenda',
};
/**
 * Obtiene la etiqueta en español para un campo
 * Si no existe, retorna el nombre original
 */
export function getFieldLabel(fieldName: string): string {
  return FIELD_LABELS[fieldName] || fieldName;
}
