export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  tokenFamilyId: string;
  replacedBy: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export class RefreshToken {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly tokenFamilyId: string;
  readonly replacedBy: string | null;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;

  constructor(props: RefreshTokenProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.tokenFamilyId = props.tokenFamilyId;
    this.expiresAt = props.expiresAt;
    this.revokedAt = props.revokedAt;
    this.replacedBy = props.replacedBy;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
  }

  static issue(params: {
    userId: string;
    tokenHash: string;
    tokenFamilyId?: string | undefined;
    expiresAt: Date;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }): RefreshToken {
    return new RefreshToken({
      id: crypto.randomUUID(),
      userId: params.userId,
      tokenHash: params.tokenHash,
      tokenFamilyId: params.tokenFamilyId ?? crypto.randomUUID(),
      replacedBy: null,
      expiresAt: params.expiresAt,
      revokedAt: null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    });
  }
  isExpired(now: Date): boolean {
    return this.expiresAt <= now;
  }
  isRevoked(): boolean {
    return this.revokedAt !== null;
  }
}
