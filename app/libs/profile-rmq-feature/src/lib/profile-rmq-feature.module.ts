import { Module } from '@nestjs/common';
import { ProfileUtilsModule } from '@org/profile-utils';

import { ProfileRmqFeatureController } from './profile-rmq-feature.controller';
import { AuthRmqFeatureService } from './services/auth/auth-rmq-feature.service';

@Module({
  imports: [ProfileUtilsModule],
  controllers: [ProfileRmqFeatureController],
  providers: [AuthRmqFeatureService],
})
export class ProfileRmqFeatureModule {}
