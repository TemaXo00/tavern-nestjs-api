import { Module } from '@nestjs/common';
import { AuthFeatureModule } from '@org/auth-feature'
import { AuthUtilsModule } from '@org/auth-utils';

import { SessionFeatureController } from './session-feature.controller';
import { SessionFeatureService } from './session-feature.service';

@Module({
  imports: [
    AuthFeatureModule,
    AuthUtilsModule
  ],
  controllers: [SessionFeatureController],
  providers: [SessionFeatureService],
  exports: [],
})
export class SessionFeatureModule {}
