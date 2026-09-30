import { Module } from '@nestjs/common';

import { RmqLoggerUtil } from './utils/logger/rmq-logger.util';
import { DateMapUtil } from './utils/map/date-map.util';
import { PaginationUtil } from './utils/pagination/pagination.util';
import { StringValidationUtil } from './utils/types/string-validation.util';

const UTILS = [
  PaginationUtil,
  StringValidationUtil,
  DateMapUtil,
  RmqLoggerUtil,
];

@Module({
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class SharedUtilsModule {}
