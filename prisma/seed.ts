import { createHash } from 'node:crypto';
import { prisma } from '../src/platform/database/prisma';
import bcrypt from 'bcryptjs';
import { PERMISSIONS } from '../src/shared/constants/permissions';
// Catálogo real de puestos con su nivel de riesgo SCTR, hoy en el sistema
// actual. Al sembrarlo, la BD pasa a ser la fuente de verdad y
// `risk-level.helper.ts` debería leer de aquí en vez de la constante.
import { SCTR_RISK_LEVELS } from '../src/domain/excel/constants/positions';
// ═══════════════════════════════════════════════════════════
// 1. CATÁLOGO DE ROLES
// ═══════════════════════════════════════════════════════════
const ROLES = [
  { name: 'SUPER_ADMIN', description: 'Acceso total a la plataforma' },
  { name: 'HR_ADMIN', description: 'Administración de RRHH' },
  { name: 'HR_ANALYST', description: 'Analista de RRHH (operativo)' },
  { name: 'MANAGER', description: 'Jefe de área' },
  { name: 'EMPLOYEE', description: 'Colaborador (autoservicio)' },
] as const;

// ═══════════════════════════════════════════════════════════
// 2. CATÁLOGO DE TIPOS DE CONTRATO (US-004, escenario 2)
//    `sunatPlameCode` queda en null a propósito: los códigos de la
//    Tabla 8 del PLAME deben copiarse de la fuente oficial de SUNAT,
//    no estimarse — un código errado distorsiona la declaración mensual.
// ═══════════════════════════════════════════════════════════
const CONTRACT_TYPES = [
  {
    code: 'INDETERMINADO',
    name: 'Contrato a plazo indeterminado',
    legalBasis: 'D. Leg. 728 — TUO D.S. 003-97-TR, art. 4',
    isFixedTerm: false,
    maxDurationMonths: null,
    requiresReplacement: false,
    isPartTime: false,
  },
  {
    code: 'INICIO_ACTIVIDAD',
    name: 'Contrato por inicio o incremento de actividad',
    legalBasis: 'D. Leg. 728 — TUO D.S. 003-97-TR, art. 57',
    isFixedTerm: true,
    maxDurationMonths: 36,
    requiresReplacement: false,
    isPartTime: false,
  },
  {
    code: 'NECESIDADES_MERCADO',
    name: 'Contrato por necesidades del mercado',
    legalBasis: 'D. Leg. 728 — TUO D.S. 003-97-TR, art. 58',
    isFixedTerm: true,
    maxDurationMonths: 60,
    requiresReplacement: false,
    isPartTime: false,
  },
  {
    code: 'SUPLENCIA',
    name: 'Contrato de suplencia',
    legalBasis: 'D. Leg. 728 — TUO D.S. 003-97-TR, art. 61',
    isFixedTerm: true,
    // La duración la marca la ausencia del titular, no un tope legal fijo.
    maxDurationMonths: null,
    requiresReplacement: true,
    isPartTime: false,
  },
  {
    code: 'PART_TIME',
    name: 'Contrato a tiempo parcial',
    legalBasis:
      'D. Leg. 728 — TUO D.S. 003-97-TR, art. 4 (jornada menor a 4 h diarias en promedio)',
    isFixedTerm: false,
    maxDurationMonths: null,
    requiresReplacement: false,
    isPartTime: true,
  },
  {
    code: 'PRACTICANTE',
    name: 'Convenio de modalidad formativa laboral',
    legalBasis: 'Ley 28518 — Modalidades Formativas Laborales',
    isFixedTerm: true,
    maxDurationMonths: null,
    requiresReplacement: false,
    isPartTime: false,
  },
] as const;

// ═══════════════════════════════════════════════════════════
// 2b. PARÁMETROS LEGALES VERSIONADOS (US-004, DoD)
//
//     ⚠️ VALORES PROVISIONALES. El backlog los declara como pregunta
//     abierta #5 ("¿Cuál es la UIT y RMV vigentes para 2026?") y no
//     coinciden con la serie histórica conocida (UIT 4,600 corresponde
//     a 2022). Confirmar contra el Decreto Supremo vigente ANTES de
//     que cualquier cálculo de planilla los consuma.
//
//     Para corregirlos basta cambiar el valor aquí y re-ejecutar el
//     seed: la fila se actualiza en sitio. Si el cambio es por un
//     nuevo periodo, agrega una entrada con otro validFrom y cierra
//     la anterior con validTo (la restricción EXCLUDE impide solapes).
// ═══════════════════════════════════════════════════════════
const LEGAL_PARAMETERS = [
  {
    code: 'UIT',
    value: '5500',
    unit: 'PEN',
    validFrom: new Date('2026-01-01T00:00:00-05:00'),
    validTo: null,
    legalReference: 'La UIT para el 2026 es de 5,500 soles',
  },
  {
    code: 'RMV',
    value: '1130',
    unit: 'PEN',
    validFrom: new Date('2026-01-01T00:00:00-05:00'),
    validTo: null,
    legalReference: 'El RMV para el 2026 es de 1,130 soles',
  },
] as const;

// ═══════════════════════════════════════════════════════════
// 2c. ORGANIZACIÓN MÍNIMA (sede, división, puestos)
//
//     Un contrato exige contract_type + position + branch + division,
//     así que sin estas filas no se puede insertar ninguno.
//
//     Ya no hay tabla `companies`: el sistema opera bajo una sola razón
//     social. Ver la migración `drop_companies`.
// ═══════════════════════════════════════════════════════════

/**
 * Identidad del empleador. NO se persiste: hoy su fuente de verdad son las
 * plantillas de contrato (src/domain/contracts/templates/templates.ts), donde
 * el RUC y el domicilio están embebidos en el texto legal. Se conserva aquí
 * como dato estructurado porque `EMPLOYER.address` alimenta la sede semilla y
 * porque es el único lugar del repositorio donde estos campos están separados.
 */
const EMPLOYER = {
  ruc: '20603381697',
  legalName: 'INVERSIONES URBANÍSTICAS OPERADORA S.A.',
  address:
    'Calle Dean Valdivia N° 148 Int. 1401 Urb. Jardín (Edificio Platinium), San Isidro, Lima',
  legalRepName: 'Catherine Susan Chang López',
  legalRepDoc: '42933662',
};

// ⚠️ PROVISIONALES. El repositorio no contiene el catálogo real de sedes
//    ni de divisiones — en el Excel ambos son texto libre. Reemplazar con
//    los datos del cliente (pregunta abierta #8 del backlog).
const BRANCHES = [
  {
    code: 'OFICINA-PRINCIPAL',
    name: 'Oficina Principal — San Isidro',
    kind: 'OFICINA',
    address: EMPLOYER.address,
  },
];

const DIVISIONS = [{ code: 'ESTACIONAMIENTOS', name: 'Estacionamientos' }];

/**
 * Código estable para un puesto: slug del nombre + hash corto.
 * El hash evita colisiones entre variantes que sí son distintas para el
 * Excel ("ANFITRION(A) C" vs "ANFITRION(A)C") y mantiene el largo ≤ 20.
 */
const positionCode = (name: string): string => {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const hash = createHash('sha1').update(name).digest('hex').slice(0, 4);
  return `${slug.slice(0, 15)}_${hash}`;
};

// ═══════════════════════════════════════════════════════════
// 3. ASIGNACIÓN ROL → PERMISOS (la matriz acordada)
//    SUPER_ADMIN se resuelve como "todos" en tiempo de seed.
// ═══════════════════════════════════════════════════════════
const ROLE_PERMISSIONS: Record<string, string[]> = {
  HR_ADMIN: [
    'colaborador:leer',
    'colaborador:crear',
    'colaborador:editar',
    'colaborador:leer_sensible',
    'colaborador:cesar',
    'organizacion:leer',
    'organizacion:editar',
    'contrato:leer',
    'contrato:crear',
    'contrato:firmar_empleador',
    'documento:generar',
    'documento:leer',
    'documento:firmar_empleador',
    'calculo:leer',
    'calculo:ejecutar_borrador',
    'calculo:aprobar',
    'vacaciones:leer',
    'vacaciones:aprobar',
    'parametro:leer',
    'parametro:editar',
    'usuario:gestionar',
    'auditoria:leer_rrhh',
  ],
  HR_ANALYST: [
    'colaborador:leer',
    'colaborador:editar',
    'organizacion:leer',
    'contrato:leer',
    'documento:generar',
    'documento:leer',
    'calculo:leer',
    'calculo:ejecutar_borrador',
    'vacaciones:leer',
    'parametro:leer',
  ],
  MANAGER: [
    'colaborador:leer',
    'organizacion:leer',
    'contrato:leer',
    'documento:leer',
    'vacaciones:leer',
    'vacaciones:solicitar',
    'vacaciones:aprobar',
  ],
  EMPLOYEE: [
    'perfil:leer',
    'perfil:editar_contacto',
    'boleta:leer',
    'contrato:leer',
    'contrato:firmar_propio',
    'documento:leer',
    'documento:acuse_propio',
    'calculo:leer',
    'vacaciones:leer',
    'vacaciones:solicitar',
  ],
};

async function seedRoles() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.info(`✅ ${ROLES.length} roles`);
}
async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { description: permission.description },
      create: { code: permission.code, description: permission.description },
    });
  }
  console.info(`✅ ${PERMISSIONS.length} permisos`);
}
async function seedRolePermissions() {
  const allRoles = await prisma.role.findMany();
  const allPerms = await prisma.permission.findMany();
  const roleIdByName = new Map(allRoles.map((r) => [r.name, r.id]));
  const permIdByCode = new Map(allPerms.map((p) => [p.code, p.id]));

  const assignments: Record<string, string[]> = {
    SUPER_ADMIN: allPerms.map((p) => p.code),
    ...ROLE_PERMISSIONS,
  };
  let count = 0;
  for (const [roleName, permCodes] of Object.entries(assignments)) {
    const roleId = roleIdByName.get(roleName);
    if (!roleId) {
      throw new Error(`Rol no encontrado en BD: ${roleName}`);
    }
    for (const code of permCodes) {
      const permissionId = permIdByCode.get(code);
      if (!permissionId) {
        throw new Error(
          `Permiso no encontrado en catálogo: "${code}" (rol ${roleName})`,
        );
      }

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {}, // idempotente: si existe, no toca nada
        create: { roleId, permissionId },
      });
      count++;
    }
  }
  console.info(`✅ ${count} role_permissions`);
}

async function seedAdminUser() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      '⚠️  BOOTSTRAP_ADMIN_EMAIL/PASSWORD no definidos; se omite admin',
    );
    return;
  }
  // email no tiene @unique (índice parcial), así que no se puede upsert por email
  const existing = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), deletedAt: null },
  });
  const passwordHash = await bcrypt.hash(password, 12);
  const user =
    existing ??
    (await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash },
    }));

  const superAdmin = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });
  if (superAdmin) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: superAdmin.id } },
      update: {},
      create: { userId: user.id, roleId: superAdmin.id },
    });
  }
  console.info(`✅ admin bootstrap: ${email}`);
}
async function seedContractTypes() {
  for (const type of CONTRACT_TYPES) {
    await prisma.contractType.upsert({
      where: { code: type.code },
      update: {
        name: type.name,
        legalBasis: type.legalBasis,
        isFixedTerm: type.isFixedTerm,
        maxDurationMonths: type.maxDurationMonths,
        requiresReplacement: type.requiresReplacement,
        isPartTime: type.isPartTime,
      },
      create: { ...type },
    });
  }
  console.info(`✅ ${CONTRACT_TYPES.length} tipos de contrato`);
}

async function seedLegalParameters() {
  // `code` no es UNIQUE: la unicidad real es code + vigencia, impuesta por el
  // EXCLUDE de la tabla. Por eso no se puede usar upsert y se busca a mano.
  for (const param of LEGAL_PARAMETERS) {
    const existente = await prisma.legalParameters.findFirst({
      where: { code: param.code, validFrom: param.validFrom },
    });
    if (existente) {
      await prisma.legalParameters.update({
        where: { id: existente.id },
        data: {
          value: param.value,
          unit: param.unit,
          validTo: param.validTo,
          legalReference: param.legalReference,
        },
      });
    } else {
      await prisma.legalParameters.create({ data: { ...param } });
    }
  }
  console.info(`✅ ${LEGAL_PARAMETERS.length} parámetros legales`);
}

async function seedBranches() {
  for (const branch of BRANCHES) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: { name: branch.name, kind: branch.kind, address: branch.address },
      create: { ...branch },
    });
  }
  console.info(`✅ ${BRANCHES.length} sede(s) — empleador: ${EMPLOYER.ruc}`);
}

async function seedDivisions() {
  for (const division of DIVISIONS) {
    await prisma.division.upsert({
      where: { code: division.code },
      update: { name: division.name },
      create: { ...division },
    });
  }
  console.info(`✅ ${DIVISIONS.length} división(es)`);
}

async function seedPositions() {
  const entries = Object.entries(SCTR_RISK_LEVELS);
  for (const [name, risk] of entries) {
    const sctrRiskLevel = risk === 'ALTO' ? 'ALTO' : 'BAJO';
    await prisma.position.upsert({
      // El único unique es `name`: el nombre es la llave natural porque es lo
      // que llega en el Excel.
      where: { name },
      update: { sctrRiskLevel, requiresSctr: sctrRiskLevel === 'ALTO' },
      create: {
        code: positionCode(name),
        name,
        sctrRiskLevel,
        requiresSctr: sctrRiskLevel === 'ALTO',
      },
    });
  }
  console.info(`✅ ${entries.length} puestos (con nivel de riesgo SCTR)`);
}

async function main() {
  console.info('🌱 Iniciando seed...');
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  await seedAdminUser();
  await seedContractTypes();
  await seedLegalParameters();
  await seedBranches();
  await seedDivisions();
  await seedPositions();
  console.info('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error('Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
