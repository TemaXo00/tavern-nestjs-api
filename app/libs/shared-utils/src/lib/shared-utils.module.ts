import { Module } from '@nestjs/common';

import { DateMapUtil } from './utils/map/date-map.util';
import { PaginationUtil } from './utils/pagination/pagination.util';
import { StringValidationUtil } from './utils/types/string-validation.util';

const UTILS = [PaginationUtil, StringValidationUtil, DateMapUtil];

@Module({
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class SharedUtilsModule {}
