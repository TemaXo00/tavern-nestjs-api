import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth-input.data.js";

export type AuthRegisterGateway = Omit<RegisterInput, 'session'>
export type AuthLoginGateway = Omit<LoginInput, 'session'>
export type AuthForgotPasswordGateway = ForgotPasswordInput
export type AuthResetPasswordGateway = Omit<ResetPasswordInput, 'token' | 'session'>
