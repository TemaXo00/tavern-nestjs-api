import {
  BlockUserInput,
  ChangeEmailInput,
  ChangePasswordInput,
  UserPaginationInput,
} from './user-input.data.js';
import { UserOutput, UserPaginationOutput } from './user-output.data.js';
import { Roles } from '../../enums/auth.enum.js';
import { Replace } from '../../utils/replace.js';

export type UserPaginationGatewayInput = Replace<
  UserPaginationInput,
  { role?: Roles }
>;

export type BlockUserGatewayInput = Omit<BlockUserInput, 'id' | 'validation'>;
export type ChangeEmailGatewayInput = Omit<ChangeEmailInput, 'validation'>;
export type ChangePasswordGatewayInput = Omit<
  ChangePasswordInput,
  'validation'
>;

export type UserPaginationGatewayOutput = Replace<
  UserPaginationOutput,
  { role?: Roles }
>;
export type UserGatewayOutput = Replace<UserOutput, { role: Roles }>;

export type PaginatedUserGatewayOutput = {
  pagination: UserPaginationGatewayOutput;
  users: UserGatewayOutput[];
};
