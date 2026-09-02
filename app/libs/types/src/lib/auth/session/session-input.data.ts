import { ValidateInput } from "../authorization/auth-input.data.js";

export interface AllSessionsByUserInput {
  userId: string;
  validation: ValidateInput
}

export interface AllMySessions {
  validation: ValidateInput
}

export interface SessionLocalNameInput {
  localName: string;
  validation: ValidateInput
}

export interface DeleteSessionByIdInput {
  sessionId: string;
  validation: ValidateInput
}

export interface DeleteAllSessionsInput {
  validation: ValidateInput
}
