import { Roles } from '../../enums/auth.enum.js';

export interface UserPayload {
  id: string;
  session_id: string;
  role: Roles
}

export interface UserEntity {
  id: string;
  email: string;
  role: Roles
  is_active: boolean;
  session_id: string;
  session_name: string;
}