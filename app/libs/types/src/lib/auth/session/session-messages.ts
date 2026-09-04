export interface SessionCheckByAdminMessage {
  userId: string;
  adminId: string;
}

export interface UserUpdatedSessionNameMessage {
  userId: string
  sessionId: string
}

export interface UserRemoveSessionMessage {
  userId: string;
  sessionId: string;
}

export interface UserRemoveAllSessionsMessage {
  userId: string
}
