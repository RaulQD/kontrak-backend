import type { Prisma } from '../../generated/prisma/client';
import { AuditEntry } from './audit-entry';

export async function writeAudit(
  tx: Prisma.TransactionClient,
  entry: AuditEntry,
): Promise<void> {
  await tx.auditLog.create({
    data: {
      actorUserId: entry.actorUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      ...(entry.oldValues != null ? { oldValues: entry.oldValues } : {}),
      ...(entry.newValues != null ? { newValues: entry.newValues } : {}),
      ipAddress: entry.ipAddress,
    },
  });
}
