export interface FieldConfig {
  aliases: string[];
  description: string;
}
export const BASE_FIELDS: Record<string, FieldConfig> = {
  name: {
    aliases: [
      'nombre',
      'name',
      'NOMBRE COMPLETO',
      'Nombre completo',
      'Nombre Completo',
    ],
    description: 'Nombre del empleado',
  },
  lastNameFather: {
    aliases: [
      'apellido paterno',
      'APELLIDO PATERNO',
      'Apellido Paterno',
      'Apellido paterno',
      'apellidopaterno',
      'apellido_paterno',
    ],
    description: 'Apellido paterno del empleado',
  },
  lastNameMother: {
    aliases: [
      'apellido materno',
      'APELLIDO MATERNO',
      'Apellido Materno',
      'Apellido materno',
      'apellidomaterno',
      'apellido_materno',
    ],
    description: 'Apellido materno del empleado',
  },
  dni: {
    aliases: ['dni', 'DNI', 'Documento de identidad', 'DOCUMENTO DE IDENTIDAD'],
    description: 'DNI o Documento de identidad',
  },
  salary: {
    aliases: [
      'salario',
      'salary',
      'sueldo',
      'remuneracion',
      'remuneración',
      'SUELDO',
    ],
    description: 'Salario o Sueldo del empleado',
  },
  salaryInWords: {
    aliases: [
      'salario en letras',
      'salarioenletras',
      'salario_en_letras',
      'salaryinwords',
      'salary_in_words',
      'sueldo en letras',
    ],
    description: 'Salario o sueldo del empleado en letras',
  },
  address: {
    aliases: ['dirección', 'direccion', 'address', 'direccion completa'],
    description: 'Dirección del empleado',
  },
  province: {
    aliases: ['provincia', 'province'],
    description: 'Provincia donde residedel empleado',
  },
  district: {
    aliases: ['distrito', 'district'],
    description: 'Distrito donde reside el emeplado',
  },
  department: {
    aliases: ['departamento', 'department', 'division'],
    description: 'Departamenteo donde reside el empleado',
  },
  entryDate: {
    aliases: [
      'INICIO',
      'inicio',
      'fecha de ingreso',
      'fechadeingreso',
      'fecha_de_ingreso',
      'entrydate',
      'entry_date',
      'fecha ingreso',
    ],
    description: 'Fecha de inicio del empleado',
  },
  subDivisionOrParking: {
    aliases: [
      'playa',
      'estacionamiento',
      'PLAYA',
      'ESTACIONAMIENTO',
      'Sub Division o playa',
    ],
    description: 'Lugar de trabajo donde trabajara el empleado',
  },
  position: {
    aliases: ['Cargo', 'CARGO', 'POSICION', 'cargo', 'Cargo', 'Posicion'],
    description: 'Cargo del empleado',
  },
  contractType: {
    aliases: [
      'tipo de contrato',
      'Tipo Contrato',
      'tipodecontrato',
      'tipo_de_contrato',
      'tipo contrato',
      'TIPO DE CONTRATO',
    ],
    description: 'Tipo de contrato del empleado',
  },
} as const;

export const COMMON_CONTRACT_FIELDS: Record<string, FieldConfig> = {
  email: {
    aliases: ['email', 'Email', 'EMAIL', 'correo', 'Correo'],
    description: 'Correo electrónico del empleado',
  },
  phone: {
    aliases: ['telefono', 'Nº teléfono', 'teléfono', 'celular', 'phone'],
    description: 'Teléfono del empleado',
  },
};
export const SUBSIDIO_SPECIFIC_FIELDS: Record<string, FieldConfig> = {
  replacementFor: {
    aliases: [
      'Suplencia de:',
      'suplencia de:',
      'Suplencia de',
      'suplencia de',
      'SUPLENCIA DE:',
      'SUPLENCIA DE',
      'Reemplazo',
      'REEMPLAZO',
      'reemplazo',
    ],
    description: 'Empelado que sera reemplazado',
  },
  reasonForSubstitution: {
    aliases: [
      'Motivo de Suplencia',
      'motivo de suplencia',
      'MOTIVO DE SUPLENCIA',
      'Motivo por Suplencia',
      'MOTIVO POR SUPLENCIA',
      'Motivo por suplencia',
      'razon de suplencia',
      'razón de suplencia',
    ],
    description: 'Motivo de suplencia',
  },
};

export const ALL_FIELDS_MAP: Record<string, FieldConfig> = {
  ...BASE_FIELDS,
  ...COMMON_CONTRACT_FIELDS,
  ...SUBSIDIO_SPECIFIC_FIELDS,
} as const;

export type ContractType = 'PLANILLA' | 'PART TIME' | 'SUBSIDIO';

export const CONTRACT_VALIDATION_RULES: Record<
  string,
  {
    description: string;
    requiredFields: string[];
  }
> = {
  PLANILLA: {
    description: 'Contrato con todo beneficios por ley.',
    requiredFields: [
      // Campos base (siempre)
      'name',
      'lastNameFather',
      'lastNameMother',
      'dni',
      'entryDate',
      'position',
      'subDivisionOrParking',
      // Campos comunes
      'province',
      'district',
      'department',
      'address',
      'salary',
      'salaryInWords',
    ],
  },
  SUBSIDIO: {
    description: 'Contrato de reemplazo',
    requiredFields: [
      // Campos base (siempre)
      'name',
      'lastNameFather',
      'lastNameMother',
      'dni',
      'entryDate',
      'position',
      'subDivisionOrParking',
      // Campos comunes
      'province',
      'district',
      'department',
      'address',
      'salary',
      'salaryInWords',
      'replacementFor',
      'reasonForSubstitution',
    ],
  },
  PART_TIME: {
    description: 'Contrato Part-Time',
    requiredFields: [
      // Campos base (siempre)
      'name',
      'lastNameFather',
      'lastNameMother',
      'dni',
      'entryDate',
      'position',
      'subDivisionOrParking',
      // Campos comunes
      'province',
      'district',
      'department',
      'address',
      'salary',
      'salaryInWords',
    ],
  },
};
/**
 * ══════════════════════════════════════════════════════════
 * HELPER: Obtener campos requeridos solo BASE
 * ══════════════════════════════════════════════════════════
 */
export function getBaseRequiredFields(): string[] {
  return Object.keys(BASE_FIELDS);
}

/**
 * ══════════════════════════════════════════════════════════
 * HELPER: Obtener campos requeridos por tipo
 * ══════════════════════════════════════════════════════════
 */
export function getRequiredFieldsByType(contractType: ContractType): string[] {
  return CONTRACT_VALIDATION_RULES[contractType].requiredFields;
}
/**
 * ══════════════════════════════════════════════════════════
 * HELPER: Verificar si un tipo de contrato es válido
 * ══════════════════════════════════════════════════════════
 */
export function isValidContractType(type: string): type is ContractType {
  return ['planilla', 'part_time', 'ape', 'subsidio'].includes(type);
}
