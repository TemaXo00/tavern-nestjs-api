import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';
import { AuthCoreUtilsModule } from '@org/auth-core-utils';

import { SessionFeatureController } from './session-feature.controller';
import { SessionFeatureService } from './session-feature.service';

@Module({
  imports: [AuthCoreUtilsModule, AuthCoreModule],
  controllers: [SessionFeatureController],
  providers: [SessionFeatureService],
})
export class SessionFeatureModule {}
