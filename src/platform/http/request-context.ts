import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
  readonly requestId: string;
  readonly ipAddress: string | null;
  actorUserId?: string; // lo fija authenticate cuando el token es valido
}

const storage = new AsyncLocalStorage<RequestContext>();

export const runWithRequestContext = <T>(ctx: RequestContext, fn: () => T): T =>
  storage.run(ctx, fn);

export const getRequestContext = (): Readonly<RequestContext> | undefined =>
  storage.getStore();
export const getRequestId = (): string | undefined =>
  storage.getStore()?.requestId;
// authenticate corre después de requestIdMiddleware: completa el contexto
// que ya existe en lugar de abrir uno nuevo.
export const setRequestActor = (userId: string): void => {
  const store = storage.getStore();
  if (store) store.actorUserId = userId;
};
