import { Module } from '@nestjs/common';

import { AuthDatabaseService } from './auth-database.service';

@Module({
  controllers: [],
  providers: [AuthDatabaseService],
  exports: [AuthDatabaseService],
})
export class AuthDatabaseModule {}
