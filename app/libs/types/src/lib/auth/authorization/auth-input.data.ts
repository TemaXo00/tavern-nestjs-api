export interface RegisterInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  session: SessionInput
}

export interface LoginInput {
  email: string;
  password: string;
  session: SessionInput
}

export interface RefreshInput {
  refreshToken: string;
  session: SessionInput
}

export interface ValidateInput {
  accessToken: string;
  session: SessionInput
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export interface SessionInput {
  os: string;
  device: string;
  browser: string;
  ip: string;
}
