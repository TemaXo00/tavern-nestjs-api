import { Module } from '@nestjs/common';
import { ProfileDatabaseModule } from '@org/profile-database';
import { SharedUtilsModule } from '@org/shared-utils';

import { ProfileDatabaseUtil } from './utils/database.util';
import { ProfileReputationUtil } from './utils/reputation.util';
import { ProfileValidationUtil } from './utils/validation.util';

const UTILS = [
  ProfileDatabaseUtil,
  ProfileValidationUtil,
  ProfileReputationUtil,
];

@Module({
  imports: [ProfileDatabaseModule, SharedUtilsModule],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ProfileUtilsModule {}
