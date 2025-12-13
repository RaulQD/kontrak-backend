import { AppErrorCode } from '../constants/app-error-code';
import { BAD_REQUEST } from '../constants/http';
import {
  ContractType,
  EmployeeData,
  ValidationError,
} from '../types/employees.types';
import { AppError } from '../utils/app-error';
import { employeeSchema } from '../validators/employee.validator';

export class ValidationService {
  validateEmployee(
    rowData: Record<string, unknown>,
    rowNumber: number,
    dniSet: Set<string>,
  ): {
    isValid: boolean;
    errors: ValidationError[];
    employee?: EmployeeData;
  } {
    const errors: ValidationError[] = [];

    if (rowData.dni && typeof rowData.dni === 'string') {
      const dni = rowData.dni.trim();
      if (dniSet.has(dni)) {
        errors.push({
          error: new AppError(
            `El DNI ${dni} ya existe en el archivo (duplicado)`,
            BAD_REQUEST,
            AppErrorCode.CONFLICT,
          ),
          row: rowNumber,
          field: 'DNI',
        });
        return { isValid: false, errors };
      }
    }
    const result = employeeSchema.safeParse(rowData);
    if (!result.success) {
      //converitr los errores zod en ValidationERror
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('. ');
        const errorCode =
          issue.code === 'invalid_type'
            ? AppErrorCode.INVALID_FIELD_FORMAT
            : AppErrorCode.VALIDATION_ERROR;
        errors.push({
          error: new AppError(issue.message, BAD_REQUEST, errorCode),
          row: rowNumber,
          field,
        });
      });
      return { isValid: false, errors };
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
      contractType: this.mapContractType(result.data.contractType),

      // Campos opcionales (solo si existen)
      ...(result.data.salary !== undefined && {
        salary: result.data.salary,
      }),
      ...(result.data.salaryInWords && {
        salaryInWords: result.data.salaryInWords,
      }),
      ...(result.data.entryDate && {
        entryDate:
          result.data.entryDate instanceof Date
            ? result.data.entryDate
            : result.data.entryDate,
      }),
      ...(result.data.endDate && {
        endDate:
          result.data.endDate instanceof Date
            ? result.data.endDate
            : result.data.endDate,
      }),
    };

    return { isValid: true, errors: [], employee };
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
  validateEmployeeInbatch(employees: Record<string, unknown>[]): {
    isValid: boolean;
    errors: ValidationError[];
    validEmployees?: EmployeeData[];
  } {
    const errors: ValidationError[] = [];
    const validEmployees: EmployeeData[] = [];
    const dniSet = new Set<string>();
    employees.forEach((rowData, index) => {
      const rowNumber = index + 2;
      const validation = this.validateEmployee(rowData, rowNumber, dniSet);
      if (validation.isValid && validation.employee) {
        validEmployees.push(validation.employee);
      } else {
        errors.push(...validation.errors);
      }
    });

    return { isValid: errors.length === 0, errors, validEmployees };
  }
}
