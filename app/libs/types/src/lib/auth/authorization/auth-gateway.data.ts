import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './auth-input.data.js';
import { AuthOutput } from './auth-output.data.js';
import { UserEntity } from './auth.entity.js';
import { Roles } from '../../enums/auth.enum.js';
import { Replace } from '../../utils/replace.js';

// Input
export type AuthRegisterGateway = Omit<RegisterInput, 'session'>;
export type AuthLoginGateway = Omit<LoginInput, 'session'>;
export type AuthForgotPasswordGateway = ForgotPasswordInput;
export type AuthResetPasswordGateway = Omit<
  ResetPasswordInput,
  'token' | 'session'
>;

// Output
export type AuthGatewayOutput = Omit<AuthOutput, 'refreshToken'>;
export type UserEntityGateway = Replace<UserEntity, { role: Roles }>;
