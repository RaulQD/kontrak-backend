import { AccessPayload } from '../types';

export interface ITokenSigner {
  signAccess(payload: AccessPayload): string;
  verifyAccess(token: string): AccessPayload;
}
