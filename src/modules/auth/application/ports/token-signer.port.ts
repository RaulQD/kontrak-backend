import { AccessPayload, VerifiedAccessPayload } from '../../domain/types';

export interface ITokenSigner {
  signAccess(payload: AccessPayload, expiresInSeconds: number): string;
  verifyAccess(token: string): VerifiedAccessPayload;
}
