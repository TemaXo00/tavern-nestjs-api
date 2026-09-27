import { Roles } from '../../enums/auth.enum.js';
import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { Replace } from '../../utils/replace.js';

export interface UserPaginationOutput extends PaginationBaseOutput {
  isBlocked?: boolean;
  isActive?: boolean;
  role?: number;
}

export interface UserOutput {
  id: string;
  email: string;
  role: number;
  isActive: boolean;
  isBlocked: boolean;
  blockedUntil: Date | null;
  blockReason: string | null;
  createdAt: Date;
}

export interface PaginatedUserOutput {
  pagination: UserPaginationOutput;
  users: UserOutput[];
}

export type UserPaginationGatewayOutput = Replace<
  UserPaginationOutput,
  { role?: Roles }
>;
export type UserGatewayOutput = Replace<UserOutput, { role: Roles }>;

export type PaginatedUserGatewayOutput = {
  pagination: UserPaginationGatewayOutput;
  users: UserGatewayOutput[];
};
