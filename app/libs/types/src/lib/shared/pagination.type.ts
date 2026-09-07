export interface PaginationBaseInput {
  page: number,
  limit: number,
  search: string
}

export interface BasePaginationOutput {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
  hasNext: boolean,
  hasPrev: boolean,
  search: string;
}
