import { Module } from '@nestjs/common';
import { AuthUtilsModule } from '@org/auth-utils'

import { AuthFeatureController } from './auth-feature.controller';
import { AuthFeatureService } from './auth-feature.service';

@Module({
  imports: [
    AuthUtilsModule
  ],
  controllers: [AuthFeatureController],
  providers: [AuthFeatureService],
  exports: [],
})
export class AuthFeatureModule {}
