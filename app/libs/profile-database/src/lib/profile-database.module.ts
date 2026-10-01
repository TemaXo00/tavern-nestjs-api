import { Module } from '@nestjs/common';

import { ProfileDatabaseService } from './profile-database.service';

@Module({
  providers: [ProfileDatabaseService],
  exports: [ProfileDatabaseService],
})
export class ProfileDatabaseModule {}
