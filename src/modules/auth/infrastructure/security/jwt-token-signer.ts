import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenSigner } from '../../domain/ports/token-signer.port';
import { AccessPayload } from '../../domain/types';

export class JwtTokenSigner implements ITokenSigner {
  constructor(private readonly secret: string) {}

  signAccess(payload: AccessPayload, expiresInSeconds: number): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expiresInSeconds,
    } as SignOptions);
  }
  verifyAccess(token: string): AccessPayload {
    return jwt.verify(token, this.secret) as AccessPayload;
  }
}
