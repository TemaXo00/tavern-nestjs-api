export interface PaginationInput {
  page: number,
  limit: number,
  search: string
}

export interface PaginationBaseOutput {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
  hasNext: boolean,
  hasPrev: boolean,
  search?: string;
}

export type PaginationBaseInput = Partial<PaginationInput>
