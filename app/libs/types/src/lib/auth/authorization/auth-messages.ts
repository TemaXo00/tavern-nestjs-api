import { SessionInput } from "./auth-input.data.js";

export interface AuthRegisteredMessage  {
  id: string;
  email: string;
  session: SessionInput;
  createdAt: Date;
}

export interface AuthLoginMessage {
  id: string;
  email: string;
  session: SessionInput;
}

export interface AuthLogoutMessage {
  userId: string;
  sessionId: string;
}

export interface AuthForgotPasswordMessage {
  email: string;
  token: string;
  tokenHash: string;
}

export type AuthMailForgotPassword = Omit<AuthForgotPasswordMessage, 'tokenHash'>

export type AuthLogForgotPassword = Omit<AuthForgotPasswordMessage, 'token'>

export interface AuthRestorePasswordMessage {
  email: string;
  session: SessionInput;
}
