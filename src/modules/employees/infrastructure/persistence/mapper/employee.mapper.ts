import { Prisma } from '../../../../../generated/prisma/client';
import type { EmployeeView } from '../../../application/port/employee.repository.port';
import type { EmployeeFullRow, EmployeeRow } from '../employee.select';
import { Employee } from '../../../domain/entities/employee.entity';

/**
 * Columnas que la app escribe. Sin `fullName` (columna generada: Postgres
 * rechaza el INSERT) ni `updatedAt` (lo pone Prisma). Como el tipo las excluye,
 * agregarlas al objeto de `toPersistence` es un error de compilación.
 */
export type EmployeeWriteData = Omit<
  Prisma.EmployeeUncheckedCreateInput,
  'fullName' | 'updatedAt'
>;

export const EmployeeMapper = {
  /**
   * Fila leída → vista de lectura.
   *
   * - Las claves sensibles solo existen en la vista si vinieron en la fila
   *   (FULL_SELECT). Sin permiso no se crean: ni siquiera en `undefined`.
   * - `fullName` no se lee: la §7.5 de docs/scrum/04 pide calcularlo con la
   *   fórmula del dominio, no arrastrar el `string | null` de la columna.
   * - Los enums de Prisma y del dominio son los mismos literales, así que se
   *   asignan sin cast: si algún día divergen, tsc falla aquí y no en runtime.
   */
  toView(row: EmployeeRow): EmployeeView {
    return {
      id: row.id,
      employeeCode: row.employeeCode,
      documentType: row.documentType,
      documentNumber: row.documentNumber,
      firstNames: row.firstNames,
      lastNameFather: row.lastNameFather,
      lastNameMother: row.lastNameMother,
      sex: row.sex,
      birthDate: row.birthDate,
      maritalStatus: row.maritalStatus,
      nationality: row.nationality,
      email: row.email,
      personalEmail: row.personalEmail,
      phone: row.phone,
      address: row.address,
      ubigeoId: row.ubigeoId,
      hireDate: row.hireDate,
      terminationDate: row.terminationDate,
      status: row.status,
      photoUrl: row.photoUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      ...(row.hasChildrenUnder18 !== undefined && {
        hasChildrenUnder18: row.hasChildrenUnder18,
      }),
      ...(row.essaludLifeInsurance !== undefined && {
        essaludLifeInsurance: row.essaludLifeInsurance,
      }),
    };
  },
  toEntity(row: EmployeeFullRow): Employee {
    return Employee.fromPersistence({
      id: row.id,
      employeeCode: row.employeeCode,
      documentType: row.documentType,
      documentNumber: row.documentNumber,
      firstNames: row.firstNames,
      lastNameFather: row.lastNameFather,
      lastNameMother: row.lastNameMother,
      sex: row.sex,
      birthDate: row.birthDate,
      maritalStatus: row.maritalStatus,
      nationality: row.nationality ?? 'PERUANA',
      email: row.email,
      personalEmail: row.personalEmail,
      phone: row.phone,
      address: row.address,
      ubigeoId: row.ubigeoId,
      hireDate: row.hireDate,
      terminationDate: row.terminationDate,
      status: row.status,
      hasChildrenUnder18: row.hasChildrenUnder18,
      essaludLifeInsurance: row.essaludLifeInsurance,
      photoUrl: row.photoUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
    });
  },

  toPersistence(employee: Employee): EmployeeWriteData {
    return {
      id: employee.id,
      employeeCode: employee.employeeCode,
      documentType: employee.documentType,
      documentNumber: employee.documentNumber,
      firstNames: employee.firstNames,
      lastNameFather: employee.lastNameFather,
      lastNameMother: employee.lastNameMother,
      sex: employee.sex,
      birthDate: employee.birthDate,
      maritalStatus: employee.maritalStatus,
      nationality: employee.nationality,
      email: employee.email,
      personalEmail: employee.personalEmail,
      phone: employee.phone,
      address: employee.address,
      ubigeoId: employee.ubigeoId,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      status: employee.status,
      hasChildrenUnder18: employee.hasChildrenUnder18,
      essaludLifeInsurance: employee.essaludLifeInsurance,
      photoUrl: employee.photoUrl,
      createdAt: employee.createdAt,
      deletedAt: employee.deletedAt,
    };
  },
};
