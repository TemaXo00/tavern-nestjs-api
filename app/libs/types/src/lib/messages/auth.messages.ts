export enum AUTHORIZATION_MESSAGES {
  REGISTER = 'user.registered',
  LOGIN = 'user.login',
  LOGOUT = 'user.logout',
  FORGOT_PASSWORD = 'user.forgot.password',
  RESTORE_PASSWORD = 'user.restore.password',
}

export enum SESSION_MESSAGES {
  CHECK = 'sessions.check',
  CHANGE_NAME = 'session.name',
  DELETE = 'session.delete',
  ALL_DELETE = 'all.sessions.delete',
}

export enum TOKEN_MESSAGES {
  CHECK = 'tokens.check',
  BY_ID = 'token.by.id',
  REVOKE = 'token.revoke',
  DELETE_ONE = 'token.delete',
  INACTIVE_DELETE = 'inactive.tokens.delete',
}

export enum USER_MESSAGES {
  CHECK = 'users.check',
  BY_ID = 'user.by.id',
  BLOCK = 'user.block',
  UNBLOCK = 'user.unblock',
  PROMOTE = 'user.promote',
  DEMOTE = 'user.demote',
  EMAIL_CHANGE = 'user.change.email',
  PASSWORD = 'user.change.password',
  SET_INACTIVE = 'user.inactive',
  SET_ACTIVE = 'user.active',
}
