import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenSigner } from '../../application/ports/token-signer.port';
import { AccessPayload, VerifiedAccessPayload } from '../../domain/types';
import {
  AccessTokenExpiredError,
  InvalidAccessTokenError,
} from '../../domain/errors/auth.error';

export class JwtTokenSigner implements ITokenSigner {
  constructor(private readonly secret: string) {}

  signAccess(payload: AccessPayload, expiresInSeconds: number): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expiresInSeconds,
    } as SignOptions);
  }
  verifyAccess(token: string): VerifiedAccessPayload {
    try {
      return jwt.verify(token, this.secret) as VerifiedAccessPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AccessTokenExpiredError();
      }
      throw new InvalidAccessTokenError();
    }
  }
}
