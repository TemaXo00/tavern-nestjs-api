import { SessionInput } from '../../shared/validation.type.js';

export interface RegisterInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  session: SessionInput;
}

export interface LoginInput {
  email: string;
  password: string;
  session: SessionInput;
}

export interface RefreshInput {
  refreshToken: string;
  session: SessionInput;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  token: string;
  newPassword: string;
  newPasswordConfirmation: string;
  session: SessionInput;
}
