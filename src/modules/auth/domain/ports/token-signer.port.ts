import { AccessPayload } from '../types';

export interface ITokenSigner {
  signAccess(payload: AccessPayload, expiresInSeconds: number): string;
  verifyAccess(token: string): AccessPayload;
}
