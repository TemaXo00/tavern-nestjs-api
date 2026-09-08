import { Injectable } from "@nestjs/common";

@Injectable()
export class PaginationUtil {
  getPaginationParams(total: number, page = 1, limit = 10): { total: number, page: number, totalPages: number, skip: number, limit: number, hasNext: boolean, hasPrev: boolean } {

    const totalPages = Math.ceil(total / limit) || 1;

    if (page > totalPages) {
      page = totalPages;
    }

    if (page <= 0) {
      page = 1
    }

    const skip = (page - 1) * limit;

    return {
      total,
      page,
      totalPages,
      skip,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
