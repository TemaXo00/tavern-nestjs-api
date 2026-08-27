export interface RegisterInput {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface ValidateInput {
  accessToken: string;
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