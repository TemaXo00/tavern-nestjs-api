import { UserPaginationInput } from './user-input.data.js';
import { SessionInput } from '../../shared/validation.type.js';

interface BaseAdminUserMessage {
  adminId: string;
  userId: string;
}

interface BaseUserMessage {
  userId: string;
}

export interface UsersCheckByAdminMessage {
  adminId: string;
  query: UserPaginationInput;
}

export type UserByIdAdminCheckMessage = BaseAdminUserMessage;

export interface AdminBlockUserMessage extends BaseAdminUserMessage {
  blockReason: string;
  blockedUntil: Date;
}

export type AdminBlockUserLog = AdminBlockUserMessage;
export type AdminBlockUserProfile = Omit<AdminBlockUserMessage, 'adminId'>;
export type AdminBlockUserMail = Omit<AdminBlockUserMessage, 'adminId'>;

export type AdminUnblockUserMessage = BaseAdminUserMessage;

export type AdminPromoteUserMessage = BaseAdminUserMessage;
export type AdminDemoteUserMessage = BaseAdminUserMessage;

export interface UserChangeEmailMessage extends BaseUserMessage {
  session: SessionInput;
}

export interface UserChangePasswordMessage extends BaseUserMessage {
  session: SessionInput;
}

export type UserSetInactiveMessage = BaseUserMessage;
export type AdminSetUserActiveMessage = BaseAdminUserMessage;
