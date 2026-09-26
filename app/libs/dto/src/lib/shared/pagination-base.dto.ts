import { PaginationBaseInput } from '@org/types';

import { Limit } from '../decorators/limit.decorator.js';
import { Page } from '../decorators/page.decorator.js';
import { Search } from '../decorators/search.decorator.js';

export class BasePaginationDto implements PaginationBaseInput {
  @Page()
  page?: number = 1;
  @Limit()
  limit?: number = 10;
  @Search()
  search?: string;
}
