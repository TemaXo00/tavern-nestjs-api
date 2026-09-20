import { PaginationBaseOutput } from "../../shared/pagination.type.js";

export interface UserPaginationOutput extends PaginationBaseOutput {
  isBlocked?: boolean
  isActive?: boolean
  role?: number
}

export interface UserOutput {
  id: string
  email: string
  role: number
  isActive: boolean
  isBlocked: boolean
  blockedUntil: Date | null
  blockReason: string | null
  createdAt: Date
}

export interface PaginatedUserOutput {
  pagination: UserPaginationOutput
  users: UserOutput[]
}
