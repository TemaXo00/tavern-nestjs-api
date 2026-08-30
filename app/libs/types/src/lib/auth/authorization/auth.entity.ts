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
