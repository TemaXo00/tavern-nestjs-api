import { Roles } from '../../enums/auth.enum.js';
import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { Protected } from '../../utils/protected.js';
import { Replace } from '../../utils/replace.js';

export interface UserPaginationInput extends PaginationBaseInput {
  isBlocked?: boolean;
  isActive?: boolean;
  role?: number;
}

export interface BlockUserBaseInput {
  id: string;
  blockedUntil: Date;
  blockReason: string;
}

export interface ChangeEmailBaseInput {
  newEmail: string;
}

export interface ChangePasswordBaseInput {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface BaseUserDeleteInput {
  password: string;
}

export type GetAllUsersInput = Protected<{ pagination: UserPaginationInput }>;
export type GetUserByIdInput = Protected<{ id: string }>;
export type BlockUserInput = Protected<BlockUserBaseInput>;
export type UnblockUserInput = Protected<{ id: string }>;
export type PromoteToModeratorInput = Protected<{ id: string }>;
export type DemoteFromModeratorInput = Protected<{ id: string }>;
export type ChangeEmailInput = Protected<ChangeEmailBaseInput>;
export type ChangePasswordInput = Protected<ChangePasswordBaseInput>;
export type SetUserInactiveInput = Protected<null>;
export type ChangeUserToActiveInput = Protected<{ id: string }>;
export type UserDeleteInput = Protected<BaseUserDeleteInput>;

export type UserPaginationGatewayInput = Replace<
  UserPaginationInput,
  { role?: Roles }
>;
export type BlockUserGatewayInput = Omit<BlockUserBaseInput, 'id'>;
