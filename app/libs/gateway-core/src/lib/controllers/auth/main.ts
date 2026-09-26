import { AuthController } from './auth.controller';
import { SessionController } from './session.controller';
import { TokenController } from './token.controller';
import { UserController } from './user.controller';

export const AUTH_CONTROLLERS = [
  AuthController,
  TokenController,
  SessionController,
  UserController,
];
