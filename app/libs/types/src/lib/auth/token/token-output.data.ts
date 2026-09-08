import { PaginationBaseOutput } from "../../shared/pagination.type.js";

export interface TokenPaginationOutput extends PaginationBaseOutput {
  state?: number;
}

export interface TokenOutput {
  id: string,
  email: string;
  state: number,
  createdAt: Date,
  expiresAt: Date
}

export interface AllTokensOutput {
  pagination: TokenPaginationOutput,
  tokens: TokenOutput[]
}
