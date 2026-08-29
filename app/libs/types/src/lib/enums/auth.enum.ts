export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export const ROLE_TO_GRPC: Record<Roles, number> = {
  [Roles.USER]: 0,
  [Roles.ADMIN]: 1,
  [Roles.MODERATOR]: 2,
};

export const GRPC_TO_ROLE: Record<number, Roles> = {
  0: Roles.USER,
  1: Roles.ADMIN,
  2: Roles.MODERATOR,
};
