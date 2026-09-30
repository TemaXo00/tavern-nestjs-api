import { Module } from '@nestjs/common';
import { ProfileUtilsModule } from '@org/profile-utils';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthRmqFeatureController } from './services/auth/auth-rmq-feature.controller';
import { AuthRmqFeatureService } from './services/auth/auth-rmq-feature.service';
import { UserRmqFeatureService } from './services/auth/user-rmq-feature.service';
import { UserRmqFeatureController } from './services/auth/user-rmq.feature.controller';

@Module({
  imports: [ProfileUtilsModule, SharedUtilsModule],
  controllers: [AuthRmqFeatureController, UserRmqFeatureController],
  providers: [AuthRmqFeatureService, UserRmqFeatureService],
})
export class ProfileRmqFeatureModule {}
