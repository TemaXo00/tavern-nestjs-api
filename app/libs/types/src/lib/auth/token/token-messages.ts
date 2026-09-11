import { TokenPaginationInput } from "./token-input.data.js";

export interface AdminCheckTokensMessage {
  id: string,
  pagination: TokenPaginationInput
}

export interface AdminGetTokenByIdMessage {
  adminId: string;
  tokenId: string;
}

export interface AdminSetTokenRevokedMessage {
  adminId: string;
  tokenId: string;
}

export interface AdminDeleteTokenMessage {
  adminId: string;
  tokenId: string;
}

export interface AdminDeleteInactiveTokensMessage {
  adminId: string;
  tokensAmount: number;
}
