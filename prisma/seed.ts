import { prisma } from '../src/platform/database/prisma';

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
// 2. CATÁLOGO DE PERMISOS
// ═══════════════════════════════════════════════════════════
const PERMISSIONS = [
  // Colaboradores (legajo)
  { code: 'colaborador:leer', description: 'Ver legajo de colaboradores' },
  { code: 'colaborador:crear', description: 'Crear legajo' },
  { code: 'colaborador:editar', description: 'Editar legajo' },
  {
    code: 'colaborador:leer_sensible',
    description: 'Ver datos sensibles (salud, derechohabientes)',
  },
  { code: 'colaborador:cesar', description: 'Dar de baja / cese' },
  // Estructura organizacional
  { code: 'organizacion:leer', description: 'Ver sedes, áreas, puestos' },
  {
    code: 'organizacion:editar',
    description: 'Crear/editar estructura organizacional',
  },
  // Contratos
  { code: 'contrato:leer', description: 'Ver contratos' },
  { code: 'contrato:crear', description: 'Crear / renovar contrato' },
  {
    code: 'contrato:firmar_empleador',
    description: 'Firmar contrato como empleador',
  },
  {
    code: 'contrato:firmar_propio',
    description: 'Firmar contrato propio (trabajador)',
  },
  // Documentos laborales
  { code: 'documento:generar', description: 'Generar documentos laborales' },
  { code: 'documento:leer', description: 'Ver documentos' },
  {
    code: 'documento:firmar_empleador',
    description: 'Firmar documentos como empleador',
  },
  {
    code: 'documento:acuse_propio',
    description: 'Dar acuse de recepción propio',
  },
  // Beneficios y cálculos
  {
    code: 'calculo:leer',
    description: 'Ver cálculos (CTS, grati, liquidación)',
  },
  {
    code: 'calculo:ejecutar_borrador',
    description: 'Ejecutar cálculo en borrador',
  },
  { code: 'calculo:aprobar', description: 'Aprobar / ejecutar planilla final' },
  // Vacaciones / ausencias
  { code: 'vacaciones:leer', description: 'Ver saldo y solicitudes' },
  { code: 'vacaciones:solicitar', description: 'Solicitar vacaciones' },
  { code: 'vacaciones:aprobar', description: 'Aprobar / rechazar solicitudes' },
  // Parámetros legales
  { code: 'parametro:leer', description: 'Ver parámetros legales' },
  { code: 'parametro:editar', description: 'Editar parámetros legales' },
  // Usuarios y accesos
  { code: 'usuario:gestionar', description: 'Crear usuarios / asignar roles' },
  // Auditoría
  { code: 'auditoria:leer_rrhh', description: 'Ver logs de auditoría de RRHH' },
  { code: 'auditoria:leer_sistema', description: 'Ver logs del sistema' },
  // Perfil propio (autoservicio)
  { code: 'perfil:leer', description: 'Ver perfil propio' },
  {
    code: 'perfil:editar_contacto',
    description: 'Editar datos de contacto propios',
  },
  { code: 'boleta:leer', description: 'Ver boletas propias' },
] as const;

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
      create: permission,
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

async function main() {
  console.info('🌱 Iniciando seed...');
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  // await seedContractTypes();
  // await seedLegalParameters();
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
