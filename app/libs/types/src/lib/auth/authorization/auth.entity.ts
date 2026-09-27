import { Roles } from '../../enums/auth.enum.js';
import { Replace } from '../../utils/replace.js';

export interface UserPayload {
  id: string;
  sessionId: string;
  role: number;
}

export interface UserEntity {
  id: string;
  email: string;
  role: number;
  isActive: boolean;
  sessionId: string;
  sessionName: string;
}

export type UserEntityGateway = Replace<UserEntity, { role: Roles }>;
