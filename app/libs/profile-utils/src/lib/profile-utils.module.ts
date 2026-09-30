import { Module } from '@nestjs/common';
import { ProfileDatabaseModule } from '@org/profile-database';

import { ProfileDatabaseUtil } from './utils/database.util';
import { ProfileValidationUtil } from './utils/validation.util';

const UTILS = [ProfileDatabaseUtil, ProfileValidationUtil];

@Module({
  imports: [ProfileDatabaseModule],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ProfileUtilsModule {}
