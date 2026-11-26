import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../src/generated/prisma/client';
import { prisma } from '../../src/platform/database/prisma';

/** Marca de las filas del fixture: employeeCode empieza así. */
const CODE_PREFIX = 'E2E-EMP-';

export const FIXTURE = {
  total: 47,
  activos: 30,
  cesados: 17,
} as const;

export interface EmployeeFixture {
  /** MARIA ELENA QUISPE ROJAS, DNI 40506070, ACTIVO, con ambos datos sensibles en true. */
  maria: string;
  /** JUAN PEREZ LOPEZ, ACTIVO. */
  juan: string;
  /** Apellido materno vacío: la columna full_name termina en espacio. */
  sinMaterno: string;
  /** ACTIVO pero anulado: no debe aparecer en ninguna lectura. */
  anulado: string;
}

const code = (n: number) => `${CODE_PREFIX}${String(n).padStart(3, '0')}`;

// Cada fila tiene su propio created_at, salvo las 10 y 11, que lo comparten
// para que el desempate por id DESC quede ejercitado.
const createdAt = (n: number) =>
  new Date(Date.UTC(2026, 0, 1, 0, n === 11 ? 10 : n));

export const borrarEmpleadosFixture = async (): Promise<void> => {
  await prisma.employee.deleteMany({
    where: { employeeCode: { startsWith: CODE_PREFIX } },
  });
};

/**
 * 47 colaboradores vigentes (30 ACTIVO, 17 CESADO) más 1 anulado, según el
 * escenario 6 de docs/scrum/04. Ningún DNI salvo el de MARIA contiene "4050",
 * y ningún nombre salvo el suyo contiene "QUISPE" (escenario 7).
 * No escribe full_name: es una columna generada.
 */
export const crearEmpleadosFixture = async (): Promise<EmployeeFixture> => {
  await borrarEmpleadosFixture();
  const ajenos = await prisma.employee.count({ where: { deletedAt: null } });
  if (ajenos > 0) {
    throw new Error(
      `kontrak_test tiene ${ajenos} colaboradores que no son del fixture: ` +
        'los totales del escenario 6 no cuadrarían. Límpialos antes de correr los e2e.',
    );
  }

  const ids: EmployeeFixture = {
    maria: randomUUID(),
    juan: randomUUID(),
    sinMaterno: randomUUID(),
    anulado: randomUUID(),
  };

  const filas: Prisma.EmployeeCreateManyInput[] = [];
  for (let n = 1; n <= FIXTURE.total; n++) {
    const activo = n <= FIXTURE.activos;
    filas.push({
      id: randomUUID(),
      employeeCode: code(n),
      documentType: 'DNI',
      documentNumber: String(70000000 + n),
      firstNames: `PRUEBA ${n}`,
      lastNameFather: 'E2E',
      lastNameMother: 'FIXTURE',
      hireDate: new Date('2025-01-15'),
      status: activo ? 'ACTIVO' : 'CESADO',
      terminationDate: activo ? null : new Date('2026-06-30'),
      createdAt: createdAt(n),
    });
  }

  Object.assign(filas[0], {
    id: ids.maria,
    documentNumber: '40506070',
    firstNames: 'MARIA ELENA',
    lastNameFather: 'QUISPE',
    lastNameMother: 'ROJAS',
    hasChildrenUnder18: true,
    essaludLifeInsurance: true,
  });
  Object.assign(filas[1], {
    id: ids.juan,
    firstNames: 'JUAN',
    lastNameFather: 'PEREZ',
    lastNameMother: 'LOPEZ',
  });
  Object.assign(filas[2], {
    id: ids.sinMaterno,
    firstNames: 'JOHN',
    lastNameFather: 'SMITH',
    lastNameMother: '',
  });

  filas.push({
    id: ids.anulado,
    employeeCode: code(FIXTURE.total + 1),
    documentType: 'DNI',
    documentNumber: String(70000000 + FIXTURE.total + 1),
    firstNames: 'ANULADO',
    lastNameFather: 'E2E',
    lastNameMother: 'FIXTURE',
    hireDate: new Date('2025-01-15'),
    status: 'ACTIVO',
    // El más reciente: si el filtro de deletedAt fallara, saldría primero.
    createdAt: new Date(Date.UTC(2026, 0, 2)),
    deletedAt: new Date(),
  });

  await prisma.employee.createMany({ data: filas });
  return ids;
};
