import { TokenPaginationInput } from "./token-input.data.js";

export interface AdminCheckTokens {
  id: string,
  pagination: TokenPaginationInput
}

export interface AdminGetTokenById {
  adminId: string;
  tokenId: string;
}

export interface AdminSetTokenRevoked {
  adminId: string;
  tokenId: string;
}

export interface AdminDeleteToken {
  adminId: string;
  tokenId: string;
}

export interface AdminDeleteInactiveTokens {
  adminId: string;
  tokensAmount: number;
}
