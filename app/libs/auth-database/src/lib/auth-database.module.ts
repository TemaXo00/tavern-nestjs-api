import { Global, Module } from '@nestjs/common';

import { AuthDatabaseService } from './auth-database.service';

@Global()
@Module({
  controllers: [],
  providers: [AuthDatabaseService],
  exports: [AuthDatabaseService],
})
export class AuthDatabaseModule {}
