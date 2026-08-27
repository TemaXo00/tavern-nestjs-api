import { Roles } from '../../enums/auth.enum.js';

export interface UserPayload {
  id: string;
  sessionId: string;
  role: Roles
}

export interface UserEntity {
  id: string;
  email: string;
  role: Roles
  isActive: boolean;
  sessionId: string;
  sessionName: string;
}