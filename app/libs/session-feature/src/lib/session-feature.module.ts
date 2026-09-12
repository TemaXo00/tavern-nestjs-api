import { Module } from '@nestjs/common';

import { SessionFeatureController } from './session-feature.controller';
import { SessionFeatureService } from './session-feature.service';

@Module({
  controllers: [SessionFeatureController],
  providers: [SessionFeatureService],
})
export class SessionFeatureModule {}
