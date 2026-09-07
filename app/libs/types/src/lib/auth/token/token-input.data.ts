import { PaginationBaseInput } from "../../shared/pagination.type.js";
import { ValidateInput } from "../authorization/auth-input.data.js";

export interface TokenPaginationInput extends PaginationBaseInput {
  state: number
}

export interface GetTokensInput {
  validation: ValidateInput
  pagination: TokenPaginationInput
}

export interface TokenByIdInput {
  validation: ValidateInput
  id: string
}

export interface RevokeTokenInput {
  id: string
  validation: ValidateInput
}

export interface DeleteTokenInput {
  id: string
  validation: ValidateInput
}

export interface DeleteAllNotActiveTokensInput {
  validation: ValidateInput
}
