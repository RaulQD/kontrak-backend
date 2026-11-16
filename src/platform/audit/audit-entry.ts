export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SOFT_DELETE: 'SOFT_DELETE',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export type AuditValues = Record<string, string | number | boolean | null>;

export type AuditEntry = {
  actorUserId: string;
  ipAddress: string | null;
  action: AuditAction;
  entityType: string; // 'Employee'
  entityId: string;
  oldValues?: AuditValues | null;
  newValues?: AuditValues | null;
};
