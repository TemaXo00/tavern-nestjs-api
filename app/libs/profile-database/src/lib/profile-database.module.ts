import { Module } from '@nestjs/common';

import { ProfileDatabaseService } from './profile-database.service';

@Module({
  controllers: [],
  providers: [ProfileDatabaseService],
  exports: [ProfileDatabaseService],
})
export class AuthDatabaseModule {}
