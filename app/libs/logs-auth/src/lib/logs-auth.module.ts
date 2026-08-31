import { Module } from '@nestjs/common';

import { LogsAuthController } from './logs-auth.controller';

@Module({
  controllers: [
    LogsAuthController
  ],
  providers: [],
  exports: [],
})
export class LogsAuthModule {}
