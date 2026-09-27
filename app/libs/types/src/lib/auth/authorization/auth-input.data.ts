import { WithSession } from '../../utils/with-session.js';

export interface RegisterBaseInput {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginBaseInput {
  email: string;
  password: string;
}

export interface RefreshBaseInput {
  refreshToken: string;
}

export interface ResetPasswordBaseInput {
  email: string;
  token: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export type RegisterInput = WithSession<RegisterBaseInput>;
export type LoginInput = WithSession<LoginBaseInput>;
export type RefreshInput = WithSession<RefreshBaseInput>;
export type ResetPasswordInput = WithSession<ResetPasswordBaseInput>;

export interface ForgotPasswordInput {
  email: string;
}

export type ResetPasswordGatewayInput = Omit<ResetPasswordBaseInput, 'token'>;
