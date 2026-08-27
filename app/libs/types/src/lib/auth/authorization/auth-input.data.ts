export interface RegisterInput {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refresh_token: string;
}

export interface ValidateInput {
  access_token: string;
}

export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  new_password: string;
  new_password_confirmation: string;
}