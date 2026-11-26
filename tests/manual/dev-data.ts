/**
 * Datos para probar a mano los endpoints (api.http) en tu base de DESARROLLO.
 *
 * Crea un usuario por rol, unos pocos colaboradores y el ubigeo 150101 (para
 * probar el alta con ubigeo hasta que US-004d cargue el catálogo). Se puede correr las veces
 * que quieras: solo toca sus propias filas (emails *@kontrak.local y códigos
 * DEV-EMP-…), así que no pisa datos tuyos.
 *
 * Uso:  pnpm tsx tests/manual/dev-data.ts
 * Contraseña de los usuarios: la misma de BOOTSTRAP_ADMIN_PASSWORD en tu .env.
 */
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Prisma } from '../../src/generated/prisma/client';
import { env } from '../../src/platform/config/env';
import { prisma } from '../../src/platform/database/prisma';

const CODE_PREFIX = 'DEV-EMP-';

const USERS = [
  { email: 'hr-admin@kontrak.local', role: 'HR_ADMIN' },
  { email: 'hr-analyst@kontrak.local', role: 'HR_ANALYST' },
  { email: 'manager@kontrak.local', role: 'MANAGER' },
  { email: 'employee@kontrak.local', role: 'EMPLOYEE' },
] as const;

const databaseName = (url: string): string =>
  decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));

const guard = (): string => {
  if (env.NODE_ENV === 'production') {
    throw new Error('dev-data no se corre en producción.');
  }
  // Los e2e exigen que kontrak_test no tenga colaboradores ajenos al fixture.
  if (databaseName(env.DATABASE_URL).endsWith('_test')) {
    throw new Error(
      'DATABASE_URL apunta a una base *_test: dev-data es para la de desarrollo.',
    );
  }
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!password) {
    throw new Error('Define BOOTSTRAP_ADMIN_PASSWORD en tu .env.');
  }
  return password;
};

const upsertUser = async (
  email: string,
  role: string,
  passwordHash: string,
): Promise<string> => {
  const { id: roleId } = await prisma.role.findUniqueOrThrow({
    where: { name: role },
  });
  // email no es @unique en Prisma (índice parcial), por eso no hay upsert.
  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          isActive: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      })
    : await prisma.user.create({ data: { email, passwordHash } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId } },
    update: {},
    create: { userId: user.id, roleId },
  });
  return user.id;
};

const employee = (
  n: number,
  data: Partial<Prisma.EmployeeCreateManyInput>,
): Prisma.EmployeeCreateManyInput => ({
  id: randomUUID(),
  employeeCode: `${CODE_PREFIX}${String(n).padStart(3, '0')}`,
  documentType: 'DNI',
  documentNumber: String(99100000 + n),
  firstNames: `PRUEBA ${n}`,
  lastNameFather: 'DEV',
  lastNameMother: 'KONTRAK',
  hireDate: new Date('2025-01-15'),
  status: 'ACTIVO',
  ...data,
});

const EMPLOYEES: Prisma.EmployeeCreateManyInput[] = [
  employee(1, {
    documentNumber: '99050607',
    firstNames: 'MARIA ELENA',
    lastNameFather: 'QUISPE',
    lastNameMother: 'ROJAS',
    hasChildrenUnder18: true,
    essaludLifeInsurance: true,
  }),
  employee(2, {
    firstNames: 'JUAN',
    lastNameFather: 'PEREZ',
    lastNameMother: 'LOPEZ',
  }),
  employee(3, {
    firstNames: 'ROSA',
    lastNameFather: 'HUAMAN',
    lastNameMother: 'TORRES',
  }),
  employee(4, {
    firstNames: 'CARLOS',
    lastNameFather: 'MENDOZA',
    lastNameMother: 'DIAZ',
    status: 'CESADO',
    terminationDate: new Date('2026-06-30'),
  }),
  employee(5, {
    firstNames: 'LUIS',
    lastNameFather: 'RAMOS',
    lastNameMother: 'CHAVEZ',
    status: 'VACACIONES',
  }),
  // Anulado: no debe aparecer en ninguna lectura de la API.
  employee(6, {
    firstNames: 'ANULADO',
    lastNameFather: 'NO',
    lastNameMother: 'VISIBLE',
    deletedAt: new Date(),
  }),
];

// Solo se crea si falta: si ya cargaste el catálogo real, no se toca.
const DEV_UBIGEO = {
  id: '150101',
  department: 'LIMA',
  province: 'LIMA',
  district: 'LIMA',
};

const main = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash(guard(), 10);

  console.info('Usuarios (contraseña = BOOTSTRAP_ADMIN_PASSWORD):');
  for (const { email, role } of USERS) {
    const id = await upsertUser(email, role, passwordHash);
    console.info(`  ${role.padEnd(11)} ${email.padEnd(26)} id=${id}`);
  }

  await prisma.employee.deleteMany({
    where: { employeeCode: { startsWith: CODE_PREFIX } },
  });
  await prisma.employee.createMany({ data: EMPLOYEES });

  await prisma.ubigeo.upsert({
    where: { id: DEV_UBIGEO.id },
    update: {},
    create: DEV_UBIGEO,
  });

  console.info('\nColaboradores:');
  for (const e of EMPLOYEES) {
    const anulado = e.deletedAt ? '  (anulado)' : '';
    console.info(
      `  ${e.id}  ${e.firstNames} ${e.lastNameFather}  ${e.status}${anulado}`,
    );
  }
  console.info(`\nUbigeo de prueba: ${DEV_UBIGEO.id} (${DEV_UBIGEO.district})`);
};

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
