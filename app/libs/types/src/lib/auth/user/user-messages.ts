import { UserPaginationInput } from "./user-input.data.js";

interface BaseAdminUserMessage {
  adminId: string
  userId: string
}

interface BaseUserMessage {
  userId: string
}

export interface UsersCheckByAdminMessage {
  adminId: string
  query: UserPaginationInput
}

export type UserByIdAdminCheckMessage = BaseAdminUserMessage

interface AdminBlockUserMessage extends BaseAdminUserMessage {
  blockReason: string
  blockedUntil: Date
}

export type AdminBlockUserLog = AdminBlockUserMessage
export type AdminBlockUserProfile = Omit<AdminBlockUserMessage, 'adminId'>

export type AdminUnblockUserMessage =  BaseAdminUserMessage

export type AdminPromoteUserMessage = BaseAdminUserMessage
export type AdminDemoteUserMessage = BaseAdminUserMessage

export type UserChangeEmailMessage = BaseUserMessage
export type UserChangePasswordMessage = BaseUserMessage

export type UserSetInactiveMessage = BaseUserMessage
export type AdminSetUserActiveMessage = BaseAdminUserMessage
