import { AuditContextProvider } from '../../shared/audit/audit-entry';
import { getRequestContext } from '../http/request-context';

export const currentAuditContext: AuditContextProvider = () => {
  const ctx = getRequestContext();
  if (!ctx?.actorUserId) {
    throw new Error('Escritura auditada fuera de una petición autenticada');
  }
  return {
    actorUserId: ctx.actorUserId,
    ipAddress: ctx.ipAddress,
    correlationId: ctx.requestId,
  };
};
