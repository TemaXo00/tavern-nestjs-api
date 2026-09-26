import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';
import { AuthCoreUtilsModule } from '@org/auth-core-utils';

import { UserFeatureController } from './user-feature.controller';
import { UserFeatureService } from './user-feature.service';

@Module({
  imports: [AuthCoreUtilsModule, AuthCoreModule],
  controllers: [UserFeatureController],
  providers: [UserFeatureService],
})
export class UserFeatureModule {}
