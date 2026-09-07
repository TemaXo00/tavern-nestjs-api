import { BasePaginationOutput } from "../../shared/pagination.type.js";

export interface TokenPaginationOutput extends BasePaginationOutput {
  state: number;
}

export interface TokenOutput {
  id: string,
  email: string;
  state: number,
  createdAt: Date,
  updatedAt: Date
}

export interface AllTokensOutput {
  pagination: TokenPaginationOutput,
  tokens: TokenOutput[]
}
