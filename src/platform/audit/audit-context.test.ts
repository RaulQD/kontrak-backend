import { describe, expect, it } from 'vitest';
import { currentAuditContext } from './audit-context';
import {
  runWithRequestContext,
  setRequestActor,
} from '../http/request-context';

describe('currentAuditContext', () => {
  it('devuelve el actor, la IP y el requestId como correlationId', () => {
    runWithRequestContext({ requestId: 'req-1', ipAddress: '10.0.0.7' }, () => {
      setRequestActor('user-1');

      expect(currentAuditContext()).toEqual({
        actorUserId: 'user-1',
        ipAddress: '10.0.0.7',
        correlationId: 'req-1',
      });
    });
  });

  it('acepta una petición sin IP conocida', () => {
    runWithRequestContext({ requestId: 'req-1', ipAddress: null }, () => {
      setRequestActor('user-1');

      expect(currentAuditContext().ipAddress).toBeNull();
    });
  });

  it('lanza un error en una petición sin actor (ruta sin authenticate)', () => {
    runWithRequestContext({ requestId: 'req-1', ipAddress: null }, () => {
      expect(() => currentAuditContext()).toThrow(
        'Escritura auditada fuera de una petición autenticada',
      );
    });
  });

  it('lanza un error fuera de una petición (script, seed, worker)', () => {
    expect(() => currentAuditContext()).toThrow(
      'Escritura auditada fuera de una petición autenticada',
    );
  });
});
