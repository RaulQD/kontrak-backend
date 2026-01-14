import { BAD_REQUEST } from '../../../shared/constants/http';
import {
  ContractType,
  EmployeeData,
  ValidationError,
} from '../../../shared/types/employees.interface';
import { AppError } from '../../../shared/utils/app-error';
import { addendumSchema } from '../validators/addendum.validator';
import {
  CONTRACT_TYPES,
  employeeSchema,
} from '../../contracts/validators/employee.validator';
import { AddendumData } from '../../../shared/types/addendum.interface';

export class ValidationService {
  validateEmployee(
    rowData: Record<string, unknown>,
    rowNumber: number,
    dniSet: Set<string>,
  ): {
    errors: ValidationError[];
    employee?: EmployeeData;
  } {
    const errors: ValidationError[] = [];

    const rawContractType = String(rowData.contractType || '')
      .trim()
      .toUpperCase();

    if (!rawContractType) {
      errors.push({
        error: new AppError('El tipo de contrato es requerido', BAD_REQUEST),
        row: rowNumber,
        field: 'contractType',
      });
      return { errors };
    }

    if (!CONTRACT_TYPES.includes(rawContractType as ContractType)) {
      return { errors: [] };
    }
    if (rowData.dni && typeof rowData.dni === 'string') {
      const dni = rowData.dni.trim();
      if (dniSet.has(dni)) {
        errors.push({
          error: new AppError(
            `El DNI ${dni} ya existe en el archivo (duplicado)`,
            BAD_REQUEST,
          ),
          row: rowNumber,
          field: 'DNI',
        });
        return { errors };
      }
    }
    const result = employeeSchema.safeParse(rowData);

    if (!result.success) {
      // Usamos map para transformar, PERO conservamos tu lógica de errorCode
      const validationErrors: ValidationError[] = result.error.issues.map(
        (issue) => {
          return {
            row: rowNumber,
            field: issue.path.join('. '),
            error: new AppError(issue.message, BAD_REQUEST),
          };
        },
      );

      return { errors: validationErrors };
    }
    dniSet.add(result.data.dni);
    //convertir de employeeFormSchema a EmployeeData
    const employee: EmployeeData = {
      // Campos obligatorios
      name: result.data.name,
      lastNameFather: result.data.lastNameFather,
      lastNameMother: result.data.lastNameMother,
      dni: result.data.dni,
      email: result.data.email,
      address: result.data.address,
      province: result.data.province,
      district: result.data.district,
      department: result.data.department,
      position: result.data.position,
      subDivisionOrParking: result.data.subDivisionOrParking,
      division: result.data.division,
      sctr: result.data.sctr,
      contractType: this.mapContractType(result.data.contractType),
      sex: result.data.sex,
      salary: result.data.salary,
      salaryInWords: result.data.salaryInWords,
      entryDate: result.data.entryDate,
      endDate: result.data.endDate,
      birthDate: result.data.birthDate,
      ...(result.data.replacementFor && {
        replacementFor: result.data.replacementFor,
      }),
      ...(result.data.reasonForSubstitution && {
        reasonForSubstitution: result.data.reasonForSubstitution,
      }),
      ...(result.data.timeForCompany && {
        timeForCompany: result.data.timeForCompany,
      }),
      ...(result.data.workingCondition && {
        workingCondition: result.data.workingCondition,
      }),
      ...(result.data.probationaryPeriod && {
        probationaryPeriod: result.data.probationaryPeriod,
      }),
    };

    return { errors: [], employee };
  }
  /**
   * Mapea el tipo de contrato de Zod al tipo del sistema
   */
  private mapContractType(tipo: string): ContractType {
    const normalized = tipo.trim();
    const lower = normalized.toLowerCase();

    if (lower === 'planilla') return 'PLANILLA';
    if (lower === 'subsidio') return 'SUBSIDIO';
    if (lower === 'part-time' || lower === 'part_time' || lower === 'part time')
      return 'PART TIME';
    if (lower === 'ape') return 'APE';
    return 'PLANILLA';
  }
  validateEmployeeInbatch(rows: Record<string, unknown>[]): {
    errors: ValidationError[];
    validEmployees?: EmployeeData[];
  } {
    const errors: ValidationError[] = [];
    const validEmployees: EmployeeData[] = [];
    const dniSet = new Set<string>();
    rows.forEach((rowData, index) => {
      const rowNumber = index + 2;
      const validation = this.validateEmployee(rowData, rowNumber, dniSet);
      if (validation.errors.length > 0) {
        errors.push(...validation.errors);
      } else if (validation.employee) {
        validEmployees.push(validation.employee);
      }
    });

    return { errors, validEmployees };
  }
  validateEmployeeAddendum(
    rowData: Record<string, unknown>,
    rowNumber: number,
    dniSet: Set<string>,
  ): {
    isValid: boolean;
    errors: ValidationError[];
    employeeAddendum?: AddendumData;
  } {
    const errors: ValidationError[] = [];
    if (rowData.documentNumber && typeof rowData.documentNumber === 'string') {
      const dni = rowData.documentNumber.trim();
      if (dniSet.has(dni)) {
        errors.push({
          error: new AppError(
            `El DNI ${dni} ya existe en este archivo (duplicado)`,
            BAD_REQUEST,
          ),
          row: rowNumber,
          field: 'documentNumber',
        });
        return { isValid: false, errors };
      }
    }
    const result = addendumSchema.safeParse(rowData);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        errors.push({
          error: new AppError(issue.message, BAD_REQUEST),
          row: rowNumber,
          field,
        });
      });
      return { isValid: false, errors };
    }
    dniSet.add(result.data.documentNumber);
    const employeeAddendum: AddendumData = {
      division: result.data.division,
      worker: result.data.worker,
      documentNumber: result.data.documentNumber,
      entryDate: result.data.entryDate,
      start: result.data.start,
      end: result.data.end,
      startAddendum: result.data.startAddendum,
      endAddendum: result.data.endAddendum,
      address: result.data.address,
      province: result.data.province,
      district: result.data.district,
      department: result.data.department,
      salary: result.data.salary,
      salaryInWords: result.data.salaryInWords,
    };
    return { isValid: true, errors: [], employeeAddendum };
  }
  validateEmployeeAddendumInBatch(rows: Record<string, unknown>[]): {
    errors: ValidationError[];
    validEmployeesAddendum?: AddendumData[];
  } {
    const errors: ValidationError[] = [];
    const validEmployeesAddendum: AddendumData[] = [];
    const dniSet = new Set<string>();
    rows.forEach((rowData, index) => {
      const rowNumber = index + 2;
      const validation = this.validateEmployeeAddendum(
        rowData,
        rowNumber,
        dniSet,
      );
      if (validation.isValid && validation.employeeAddendum) {
        validEmployeesAddendum.push(validation.employeeAddendum);
      } else {
        errors.push(...validation.errors);
      }
    });
    return { errors, validEmployeesAddendum };
  }
}
