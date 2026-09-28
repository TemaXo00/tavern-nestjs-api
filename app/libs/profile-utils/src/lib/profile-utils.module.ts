import { Module } from '@nestjs/common';
import { ProfileDatabaseModule } from '@org/profile-database';

import { ProfileDatabaseUtil } from './utils/database.util';

const UTILS = [ProfileDatabaseUtil];

@Module({
  imports: [ProfileDatabaseModule],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ProfileUtilsModule {}
