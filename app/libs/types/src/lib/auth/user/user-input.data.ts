import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { ValidateInput } from '../../shared/validation.type.js';

export interface UserPaginationInput extends PaginationBaseInput {
  isBlocked?: boolean;
  isActive?: boolean;
  role?: number;
}

export interface GetAllUsersInput {
  validation: ValidateInput;
  pagination: UserPaginationInput;
}

export interface GetUserByIdInput {
  id: string;
  validation: ValidateInput;
}

export interface BlockUserInput {
  id: string;
  blockedUntil: Date;
  blockReason: string;
  validation: ValidateInput;
}

export interface UnblockUserInput {
  id: string;
  validation: ValidateInput;
}

export interface PromoteToModeratorInput {
  id: string;
  validation: ValidateInput;
}

export interface DemoteFromModeratorInput {
  id: string;
  validation: ValidateInput;
}

export interface ChangeEmailInput {
  newEmail: string;
  validation: ValidateInput;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  validation: ValidateInput;
}

export interface SetUserInactiveInput {
  validation: ValidateInput;
}

export interface ChangeUserToActiveInput {
  id: string;
  validation: ValidateInput;
}
