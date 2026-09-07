// ROLES ENUM

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

// TOKEN ENUM

export enum TokenStates {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  USED = 'USED',
  EXPIRED = 'EXPIRED'
}

export const TOKEN_STATE_TO_GRPC: Record<TokenStates, number> = {
  [TokenStates.ACTIVE]: 0,
  [TokenStates.REVOKED]: 1,
  [TokenStates.USED]: 2,
  [TokenStates.EXPIRED]: 3
}

export const GRPC_TO_TOKEN_STATE: Record<number, TokenStates> = {
  0: TokenStates.ACTIVE,
  1: TokenStates.REVOKED,
  2: TokenStates.USED,
  3: TokenStates.EXPIRED
}
