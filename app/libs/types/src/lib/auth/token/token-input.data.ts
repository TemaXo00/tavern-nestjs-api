import { TokenStates } from '../../enums/auth.enum.js';
import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { Protected } from '../../utils/protected.js';
import { Replace } from '../../utils/replace.js';

export interface TokenPaginationInput extends PaginationBaseInput {
  state?: number;
}

export type GetTokensInput = Protected<{ pagination: TokenPaginationInput }>;
export type TokenByIdInput = Protected<{ id: string }>;
export type RevokeTokenInput = Protected<{ id: string }>;
export type DeleteTokenInput = Protected<{ id: string }>;
export type DeleteAllNotActiveTokensInput = Protected<null>;

export type TokenGatewayPaginationInput = Replace<
  TokenPaginationInput,
  { state?: TokenStates }
>;
