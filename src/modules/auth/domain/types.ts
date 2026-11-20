export type AccessPayload = {
  sub: string;
  email: string;
  permissions: string[];
};
export type VerifiedAccessPayload = AccessPayload & {
  iat: number;
  exp: number;
};

export type UserAccessStatus = {
  isActive: boolean;
  tokensRevokedAt: Date | null;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};
