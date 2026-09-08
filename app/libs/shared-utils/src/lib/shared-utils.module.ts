import { Module } from '@nestjs/common';

import { PaginationUtil } from './utils/pagination/pagination.util';
import { StringValidationUtil } from './utils/types/string-validation.util';

const UTILS = [PaginationUtil, StringValidationUtil]

@Module({
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class SharedUtilsModule {}
