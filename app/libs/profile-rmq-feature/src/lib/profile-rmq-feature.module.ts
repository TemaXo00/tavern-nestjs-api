import { Module } from '@nestjs/common';
import { ProfileUtilsModule } from '@org/profile-utils';

import { ProfileRmqFeatureController } from './profile-rmq-feature.controller';
import { ProfileRmqFeatureService } from './profile-rmq-feature.service';

@Module({
  imports: [ProfileUtilsModule],
  controllers: [ProfileRmqFeatureController],
  providers: [ProfileRmqFeatureService],
})
export class ProfileRmqFeatureModule {}
