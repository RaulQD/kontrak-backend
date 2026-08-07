import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenSigner } from '../../domain/ports/token-signer.port';
import { AccessPayload } from '../../domain/types';
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
  verifyAccess(token: string): AccessPayload {
    try {
      return jwt.verify(token, this.secret) as AccessPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AccessTokenExpiredError();
      }
      throw new InvalidAccessTokenError();
    }
  }
}
