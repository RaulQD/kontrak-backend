import { InvalidEmployeeDataError } from '../errors/employee.error';
import { buildFullName } from '../full-name';
import {
  DocumentType,
  EmployeeStatus,
  EmployeeUpdatePatch,
  MaritalStatus,
  Sex,
} from '../types';

/** Formato por tipo de documento. Solo DNI tiene respaldo de CHECK en la BD
 *  (ckemployeesdniformat); los otros tres los sostiene únicamente el dominio.
 *  R2: confirmar CE / PASAPORTE / PTP con el contador contra la tabla de SUNAT. */
export const DOCUMENT_PATTERNS: Record<DocumentType, RegExp> = {
  DNI: /^\d{8}$/,
  CE: /^[0-9A-Z]{9,12}$/,
  PASAPORTE: /^[0-9A-Z]{6,12}$/,
  PTP: /^\d{9}$/,
};
const UBIGEO_PATTERN = /^\d{6}$/;
/** El correo corporativo se guarda y se compara sin espacios y en minúsculas. */
const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/** Longitudes de schema.prisma. Sin esto, POstgres responde 22001 -> 500 opaco */
const MAX = {
  employeeCode: 20,
  documentNumber: 15,
  firstNames: 100,
  lastNameFather: 60,
  lastNameMother: 60,
  nationality: 40,
  email: 150,
  personalEmail: 150,
  phone: 20,
  address: 300,
  photoUrl: 500,
} as const;

export interface EmployeeProps {
  id: string;
  employeeCode: string | null;
  documentType: DocumentType;
  documentNumber: string;
  firstNames: string;
  lastNameFather: string;
  lastNameMother: string;
  sex: Sex | null;
  birthDate: Date | null;
  maritalStatus: MaritalStatus | null;
  nationality: string;
  email: string;
  personalEmail: string | null;
  phone: string | null;
  address: string | null;
  ubigeoId: string | null;
  hireDate: Date;
  terminationDate: Date | null;
  status: EmployeeStatus;
  hasChildrenUnder18: boolean;
  essaludLifeInsurance: boolean;
  photoUrl: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}
export type NewEmployeeProps = Omit<
  EmployeeProps,
  'id' | 'status' | 'terminationDate' | 'createdAt' | 'deletedAt'
>;

export class Employee {
  readonly id: string;
  readonly createdAt: Date;
  readonly employeeCode: string | null;
  readonly documentType: DocumentType;
  readonly documentNumber: string;
  readonly firstNames: string;
  readonly lastNameFather: string;
  readonly lastNameMother: string;
  readonly sex: Sex | null;
  readonly birthDate: Date | null;
  readonly maritalStatus: MaritalStatus | null;
  readonly nationality: string;
  readonly email: string;
  readonly personalEmail: string | null;
  readonly phone: string | null;
  readonly address: string | null;
  readonly ubigeoId: string | null;
  readonly hireDate: Date;
  readonly terminationDate: Date | null;
  readonly status: EmployeeStatus;
  readonly hasChildrenUnder18: boolean;
  readonly essaludLifeInsurance: boolean;
  readonly photoUrl: string | null;
  readonly deletedAt: Date | null;

  private constructor(props: EmployeeProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.employeeCode = props.employeeCode;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.firstNames = props.firstNames;
    this.lastNameFather = props.lastNameFather;
    this.lastNameMother = props.lastNameMother;
    this.sex = props.sex;
    this.birthDate = props.birthDate;
    this.maritalStatus = props.maritalStatus;
    this.nationality = props.nationality;
    this.email = props.email;
    this.personalEmail = props.personalEmail;
    this.phone = props.phone;
    this.address = props.address;
    this.ubigeoId = props.ubigeoId;
    this.hireDate = props.hireDate;
    this.terminationDate = props.terminationDate;
    this.status = props.status;
    this.hasChildrenUnder18 = props.hasChildrenUnder18;
    this.essaludLifeInsurance = props.essaludLifeInsurance;
    this.photoUrl = props.photoUrl;
    this.deletedAt = props.deletedAt;
  }
  static create(props: NewEmployeeProps, id: string, now: Date): Employee {
    const employee = new Employee({
      ...props,
      email: normalizeEmail(props.email),
      id,
      status: 'ACTIVO',
      terminationDate: null,
      createdAt: now,
      deletedAt: null,
    });
    employee.validate();
    return employee;
  }
  static fromPersistence(props: EmployeeProps): Employee {
    const employee = new Employee(props);
    return employee;
  }

  withPatch(patch: EmployeeUpdatePatch): Employee {
    // Una clave presente con `undefined` significa "no tocar": se descarta
    // para que no pise el valor actual (ver docs/scrum/04 §7.5).
    const changes = Object.fromEntries(
      Object.entries(patch).filter(([, value]) => value !== undefined),
    ) as EmployeeUpdatePatch;
    if (changes.email !== undefined) {
      changes.email = normalizeEmail(changes.email);
    }
    const candidate = new Employee({ ...this, ...changes });
    candidate.validate();
    return candidate;
  }
  terminate(date: Date): Employee {
    const candidate = new Employee({
      ...this,
      status: 'CESADO',
      terminationDate: date,
    });
    candidate.validate();
    return candidate;
  }
  markDelete(now: Date): Employee {
    return new Employee({ ...this, deletedAt: now });
  }
  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
  fullName(): string {
    return buildFullName(this);
  }
  private validate(): void {
    this.assertDocument();
    this.assertEmail();
    this.assertLengths();
    this.assertUbigeo();
    this.assertNationality();
    this.assertStatusTerminationCoherence();
    this.assertDateRange();
  }
  private assertDocument(): void {
    const pattern = DOCUMENT_PATTERNS[this.documentType];
    if (!pattern.test(this.documentNumber)) {
      throw new InvalidEmployeeDataError(
        `El número de documento no tiene el formato válido para ${this.documentType}`,
      );
    }
  }
  private assertEmail(): void {
    // El formato lo valida el schema; el dominio garantiza que exista.
    if (this.email === '') {
      throw new InvalidEmployeeDataError(
        'El correo corporativo es obligatorio',
      );
    }
  }
  private assertLengths(): void {
    const checks: Array<[keyof typeof MAX, string | null]> = [
      ['employeeCode', this.employeeCode],
      ['documentNumber', this.documentNumber],
      ['firstNames', this.firstNames],
      ['lastNameFather', this.lastNameFather],
      ['lastNameMother', this.lastNameMother],
      ['nationality', this.nationality],
      ['email', this.email],
      ['personalEmail', this.personalEmail],
      ['phone', this.phone],
      ['address', this.address],
      ['photoUrl', this.photoUrl],
    ];
    for (const [field, value] of checks) {
      if (value !== null && value.length > MAX[field]) {
        throw new InvalidEmployeeDataError(
          `El campo ${field} excede ${MAX[field]} caracteres`,
        );
      }
    }
  }

  private assertUbigeo(): void {
    // Es @db.Char(6): con 5 dígitos Postgres rellena con espacios
    // y la FK falla en silencio (§7.3).
    if (this.ubigeoId !== null && !UBIGEO_PATTERN.test(this.ubigeoId)) {
      throw new InvalidEmployeeDataError('El ubigeo debe tener 6 dígitos');
    }
  }

  private assertNationality(): void {
    // El @default("PERUANA") NO aplica si mandás null explícito (§7.3).
    if (this.nationality.trim() === '') {
      throw new InvalidEmployeeDataError(
        'La nacionalidad no puede estar vacía',
      );
    }
  }

  private assertStatusTerminationCoherence(): void {
    // Doble dirección: ni cesados sin fecha, ni activos con fecha de cese.
    if (this.status === 'CESADO' && this.terminationDate === null) {
      throw new InvalidEmployeeDataError(
        'Un colaborador CESADO requiere fecha de cese',
      );
    }
    if (this.status !== 'CESADO' && this.terminationDate !== null) {
      throw new InvalidEmployeeDataError(
        'Solo un colaborador CESADO puede tener fecha de cese',
      );
    }
  }

  private assertDateRange(): void {
    // Respalda ckemployeesterminationrange: sin esto sale 500 en vez de 422.
    if (this.terminationDate !== null && this.terminationDate < this.hireDate) {
      throw new InvalidEmployeeDataError(
        'La fecha de cese no puede ser anterior a la fecha de ingreso',
      );
    }
  }
}
