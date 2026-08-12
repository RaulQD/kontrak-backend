export type AccessPayload = {
  sub: string;
  email: string;
  permissions: string[];
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};
