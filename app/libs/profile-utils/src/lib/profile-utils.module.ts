import { Module } from '@nestjs/common';
import { ProfileDatabaseModule } from '@org/profile-database';

@Module({
  imports: [ProfileDatabaseModule],
  providers: [],
  exports: [],
})
export class ProfileUtilsModule {}
