import { ValidateInput } from '../../shared/validation.type.js';

export interface AllSessionsByUserInput {
  userId: string;
  validation: ValidateInput;
}

export interface AllMySessionsInput {
  validation: ValidateInput;
}

export interface SessionLocalNameInput {
  localName: string;
  validation: ValidateInput;
}

export interface DeleteSessionByIdInput {
  sessionId: string;
  validation: ValidateInput;
}

export interface DeleteAllSessionsInput {
  validation: ValidateInput;
}
