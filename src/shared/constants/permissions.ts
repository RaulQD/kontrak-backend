// ═══════════════════════════════════════════════════════════
// CATÁLOGO DE PERMISOS
// ═══════════════════════════════════════════════════════════
// `code`        → identificador interno (recurso:accion), viaja en el JWT.
// `label`       → frase para el usuario final: "No tienes permisos para {label}".
// `description` → texto administrativo, es lo único que se guarda en la BD.
export const PERMISSIONS = [
  // Colaboradores (legajo)
  {
    code: 'colaborador:leer',
    label: 'consultar colaboradores',
    description: 'Ver legajo de colaboradores',
  },
  {
    code: 'colaborador:crear',
    label: 'crear colaboradores',
    description: 'Crear legajo',
  },
  {
    code: 'colaborador:editar',
    label: 'editar colaboradores',
    description: 'Editar legajo',
  },
  {
    code: 'colaborador:leer_sensible',
    label: 'consultar datos sensibles de colaboradores',
    description: 'Ver datos sensibles (salud, derechohabientes)',
  },
  {
    code: 'colaborador:cesar',
    label: 'registrar ceses de colaboradores',
    description: 'Dar de baja / cese',
  },
  // Estructura organizacional
  {
    code: 'organizacion:leer',
    label: 'consultar la estructura organizacional',
    description: 'Ver sedes, áreas, puestos',
  },
  {
    code: 'organizacion:editar',
    label: 'editar la estructura organizacional',
    description: 'Crear/editar estructura organizacional',
  },
  // Contratos
  {
    code: 'contrato:leer',
    label: 'consultar contratos',
    description: 'Ver contratos',
  },
  {
    code: 'contrato:crear',
    label: 'crear o renovar contratos',
    description: 'Crear / renovar contrato',
  },
  {
    code: 'contrato:firmar_empleador',
    label: 'firmar contratos como empleador',
    description: 'Firmar contrato como empleador',
  },
  {
    code: 'contrato:firmar_propio',
    label: 'firmar tu propio contrato',
    description: 'Firmar contrato propio (trabajador)',
  },
  // Documentos laborales
  {
    code: 'documento:generar',
    label: 'generar documentos laborales',
    description: 'Generar documentos laborales',
  },
  {
    code: 'documento:leer',
    label: 'consultar documentos',
    description: 'Ver documentos',
  },
  {
    code: 'documento:firmar_empleador',
    label: 'firmar documentos como empleador',
    description: 'Firmar documentos como empleador',
  },
  {
    code: 'documento:acuse_propio',
    label: 'dar acuse de recepción de tus documentos',
    description: 'Dar acuse de recepción propio',
  },
  // Beneficios y cálculos
  {
    code: 'calculo:leer',
    label: 'consultar cálculos',
    description: 'Ver cálculos (CTS, grati, liquidación)',
  },
  {
    code: 'calculo:ejecutar_borrador',
    label: 'ejecutar cálculos en borrador',
    description: 'Ejecutar cálculo en borrador',
  },
  {
    code: 'calculo:aprobar',
    label: 'aprobar planillas',
    description: 'Aprobar / ejecutar planilla final',
  },
  // Vacaciones / ausencias
  {
    code: 'vacaciones:leer',
    label: 'consultar vacaciones',
    description: 'Ver saldo y solicitudes',
  },
  {
    code: 'vacaciones:solicitar',
    label: 'solicitar vacaciones',
    description: 'Solicitar vacaciones',
  },
  {
    code: 'vacaciones:aprobar',
    label: 'aprobar solicitudes de vacaciones',
    description: 'Aprobar / rechazar solicitudes',
  },
  // Parámetros legales
  {
    code: 'parametro:leer',
    label: 'consultar parámetros legales',
    description: 'Ver parámetros legales',
  },
  {
    code: 'parametro:editar',
    label: 'editar parámetros legales',
    description: 'Editar parámetros legales',
  },
  // Usuarios y accesos
  {
    code: 'usuario:gestionar',
    label: 'gestionar usuarios',
    description: 'Crear usuarios / asignar roles',
  },
  // Auditoría
  {
    code: 'auditoria:leer_rrhh',
    label: 'consultar la auditoría de RRHH',
    description: 'Ver logs de auditoría de RRHH',
  },
  {
    code: 'auditoria:leer_sistema',
    label: 'consultar la auditoría del sistema',
    description: 'Ver logs del sistema',
  },
  // Perfil propio (autoservicio)
  {
    code: 'perfil:leer',
    label: 'consultar tu perfil',
    description: 'Ver perfil propio',
  },
  {
    code: 'perfil:editar_contacto',
    label: 'editar tus datos de contacto',
    description: 'Editar datos de contacto propios',
  },
  {
    code: 'boleta:leer',
    label: 'consultar tus boletas',
    description: 'Ver boletas propias',
  },
] as const;

export type PermissionCode = (typeof PERMISSIONS)[number]['code'];

const TAGS = new Map<string, string>(PERMISSIONS.map((p) => [p.code, p.label]));

/** Frase legible para el usuario final; nunca expone el código interno. */
export const permissionLabel = (code: string): string =>
  TAGS.get(code) ?? 'realizar esta acción';
