export type AccessPayload = { sub: string };

export type authenticatedUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};
