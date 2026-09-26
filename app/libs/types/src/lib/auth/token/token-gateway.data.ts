import type { TokenPaginationInput } from './token-input.data.js';
import type {
  TokenOutput,
  TokenPaginationOutput,
} from './token-output.data.js';
import type { TokenStates } from '../../enums/auth.enum.js';
import type { Replace } from '../../utils/replace.js';

export type TokenPaginationInputGateway = Replace<
  TokenPaginationInput,
  { state?: TokenStates }
>;

export type TokenGatewayOutput = Replace<TokenOutput, { state: TokenStates }>;
export type TokenPaginationOutputGateway = Replace<
  TokenPaginationOutput,
  { state?: TokenStates }
>;

export type AllTokensGateway = {
  pagination: TokenPaginationOutputGateway;
  tokens: TokenGatewayOutput[];
};
