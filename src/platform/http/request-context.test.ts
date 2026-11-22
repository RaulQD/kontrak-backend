import { describe, expect, it } from 'vitest';
import {
  getRequestContext,
  getRequestId,
  runWithRequestContext,
  setRequestActor,
} from './request-context';

const esperar = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const contexto = (requestId: string) => ({
  requestId,
  ipAddress: '127.0.0.1',
});

describe('request-context', () => {
  it('expone el contexto de la petición en curso', () => {
    runWithRequestContext(contexto('req-1'), () => {
      expect(getRequestContext()).toEqual({
        requestId: 'req-1',
        ipAddress: '127.0.0.1',
      });
      expect(getRequestId()).toBe('req-1');
    });
  });

  it('devuelve undefined fuera de una petición', () => {
    expect(getRequestContext()).toBeUndefined();
  });

  it('setRequestActor completa el contexto y el actor sigue visible después de un await', async () => {
    await runWithRequestContext(contexto('req-1'), async () => {
      setRequestActor('user-1');
      await esperar(1);

      expect(getRequestContext()?.actorUserId).toBe('user-1');
    });
  });

  it('el actor que fija una función async interna lo ve quien la llamó', async () => {
    // Así trabaja authenticate: fija el actor dentro de su propia función async
    // y el resto de la petición lo lee después. Con un storage.run anidado,
    // en lugar de modificar el objeto, este test fallaría.
    await runWithRequestContext(contexto('req-1'), async () => {
      const autenticar = async () => {
        await esperar(1);
        setRequestActor('user-1');
      };
      await autenticar();

      expect(getRequestContext()?.actorUserId).toBe('user-1');
    });
  });

  it('dos peticiones concurrentes no mezclan sus actores', async () => {
    const peticion = (requestId: string, actor: string, demora: number) =>
      runWithRequestContext(contexto(requestId), async () => {
        setRequestActor(actor);
        // Las demoras cruzadas hacen que cada petición lea su actor mientras
        // la otra ya fijó el suyo.
        await esperar(demora);
        return getRequestContext();
      });

    const [a, b] = await Promise.all([
      peticion('req-a', 'user-a', 20),
      peticion('req-b', 'user-b', 5),
    ]);

    expect(a).toMatchObject({ requestId: 'req-a', actorUserId: 'user-a' });
    expect(b).toMatchObject({ requestId: 'req-b', actorUserId: 'user-b' });
  });

  it('setRequestActor no hace nada fuera de una petición', () => {
    expect(() => setRequestActor('user-1')).not.toThrow();
    expect(getRequestContext()).toBeUndefined();
  });
});
