export interface FieldConfig {
  aliases: string[];
  description: string;
}
export const LOCATION_FIELDS: Record<string, FieldConfig> = {
  address: {
    aliases: [
      'dirección',
      'direccion',
      'address',
      'direccion completa',
      'DOMICILIO',
      'domicilio',
      'Dirección',
    ],
    description: 'Dirección del empleado o Domicilio',
  },
  province: {
    aliases: ['provincia', 'province'],
    description: 'Provincia donde residedel empleado',
  },
  district: {
    aliases: ['distrito', 'district', 'Distrito'],
    description: 'Distrito donde reside el emeplado',
  },
  department: {
    aliases: ['departamento', 'department', 'division', 'Departamento'],
    description: 'Departamenteo donde reside el empleado',
  },
};
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
  endDate: {
    aliases: [
      'FIN',
      'fecha de fin',
      'fechadefin',
      'fecha_de_fin',
      'fecha de termino',
      'fecha_de_termino',
      'FECHA DE TERMINO',
      'Fecha de Termino',
      'Fecha de fin',
      'Fecha Fin',
      'Fecha Termino',
      'Termino',
      'Fin Contrato',
    ],
    description: 'Fecha de terminode contrato',
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
};
export const COMMON_CONTRACT_FIELDS: Record<string, FieldConfig> = {
  email: {
    aliases: ['email', 'Email', 'EMAIL', 'correo', 'Correo'],
    description: 'Correo electrónico del empleado',
  },
  phone: {
    aliases: ['telefono', 'Nº teléfono', 'teléfono', 'celular', 'phone'],
    description: 'Teléfono del empleado',
  },
  birthDate: {
    aliases: [
      'Fecha Nac.',
      'fecha de nacimiento',
      ' FECHA DE NACIMIENTO',
      'Fecha de Nac.',
    ],
    description: 'Fecha de nacimiento del empleado',
  },
  sex: {
    aliases: ['GENERO', 'genero', 'sexo', 'SEXO', 'sex'],
    description: 'Genero del empleado',
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

export const ADDENDUM_FIELDS: Record<string, FieldConfig> = {
  division: {
    aliases: ['DIVISION', 'división', 'division', 'area', 'AREA', 'Division'],
    description: 'División o área de trabajo',
  },
  documentNumber: {
    aliases: [
      'Numero Documento',
      'dni',
      'documento',
      'NÚMERO DE DOCUMENTO',
      'Num. Documento',
    ],
    description: 'Número de documento de identidad',
  },
  worker: {
    aliases: [
      'TRABAJADOR',
      'trabajador',
      'nombres y apellidos',
      'empleado',
      'colaborador',
      'Trabajador',
    ],
    description: 'Nombre completo del trabajador',
  },
  entryDate: {
    aliases: [
      'fecha de ingreso',
      'fechadeingreso',
      'fecha_de_ingreso',
      'entrydate',
      'entry_date',
      'fecha ingreso',
      'Fecha Ingreso',
    ],
    description: 'Fecha de inicio del empleado',
  },
  start: {
    aliases: ['INICIO', 'inicio', 'Inicio'],
    description: 'Fecha de inicio del contrato original',
  },
  end: {
    aliases: [
      'FECHA FIN',
      'fecha fin',
      'fin contrato',
      'termino',
      'Fin',
      'FIN',
      'fin',
    ],
    description: 'Fecha de fin del contrato original',
  },
  salary: {
    aliases: [
      'salario',
      'salary',
      'sueldo',
      'remuneracion',
      'remuneración',
      'Sueldo',
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
      'Sueldo en Letras',
    ],
    description: 'Salario o sueldo del empleado en letras',
  },
  // Fechas específicas de la adenda
  startAddendum: {
    aliases: [
      'INICIO ADENDA',
      'inicio adenda',
      'fecha inicio adenda',
      'vigencia desde',
      'Inicio Adenda',
    ],
    description: 'Fecha donde inicia la vigencia de la adenda',
  },
  endAddendum: {
    aliases: ['FIN ADENDA', 'fin adenda', 'fecha fin adenda', 'vigencia hasta'],
    description: 'Fecha donde termina la vigencia de la adenda',
  },
};
export const CONTRACT_FIELDS_MAP: Record<string, FieldConfig> = {
  ...BASE_FIELDS,
  ...COMMON_CONTRACT_FIELDS,
  ...SUBSIDIO_SPECIFIC_FIELDS,
  ...LOCATION_FIELDS,
};
export const ADDENDUM_FIELDS_MAP: Record<string, FieldConfig> = {
  ...ADDENDUM_FIELDS,
  ...LOCATION_FIELDS,
};

export type ContractType = 'PLANILLA' | 'PART TIME' | 'SUBSIDIO' | 'APE';

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
      'endDate',
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
      'endDate',
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
      'endDate',
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
  APE: {
    description: 'Contrato APE',
    requiredFields: [
      // Campos base (siempre)
      'name',
      'lastNameFather',
      'lastNameMother',
      'dni',
      'entryDate',
      'endDate',
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
