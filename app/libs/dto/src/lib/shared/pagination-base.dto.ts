import { PaginationBaseInput } from '@org/types';

import { Limit } from '../decorators/pagination/limit.decorator.js';
import { Page } from '../decorators/pagination/page.decorator.js';
import { Search } from '../decorators/pagination/search.decorator.js';

export class BasePaginationDto implements PaginationBaseInput {
  @Page()
  page?: number = 1;
  @Limit()
  limit?: number = 10;
  @Search()
  search?: string;
}
