export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export type AuditValue = string | number | boolean | null;
export type AuditValues = Record<string, AuditValue>;

export type AuditContext = {
  actorUserId: string;
  ipAddress: string | null;
  correlationId: string; // = X-Request-Id: une los logs de la petición con sus filas de auditoría
};
export type AuditContextProvider = () => AuditContext;

export type AuditEntry = AuditContext & {
  action: AuditAction;
  entityType: string; // nombre de la tabla: 'employees'
  entityId: string;
  oldValues?: AuditValues | null;
  newValues?: AuditValues | null;
};
