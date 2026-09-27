import { TokenStates } from '../../enums/auth.enum.js';
import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { Replace } from '../../utils/replace.js';

export interface TokenPaginationOutput extends PaginationBaseOutput {
  state?: number;
}

export interface TokenOutput {
  id: string;
  email: string;
  state: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface AllTokensOutput {
  pagination: TokenPaginationOutput;
  tokens: TokenOutput[];
}

export type TokenGatewayPaginationOutput = Replace<
  TokenPaginationOutput,
  { state?: TokenStates }
>;

export type TokenGatewayOutput = Replace<TokenOutput, { state: TokenStates }>;

export type AllTokensGatewayOutput = {
  pagination: TokenGatewayPaginationOutput;
  tokens: TokenGatewayOutput[];
};
