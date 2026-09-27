import { Protected } from '../../utils/protected.js';

export interface SessionLocalNameBaseInput {
  localName: string;
}

export type AllSessionsByUserInput = Protected<{ userId: string }>;
export type AllMySessionsInput = Protected<null>;
export type SessionLocalNameInput = Protected<SessionLocalNameBaseInput>;
export type DeleteSessionByIdInput = Protected<{ sessionId: string }>;
export type DeleteAllSessionsInput = Protected<null>;
