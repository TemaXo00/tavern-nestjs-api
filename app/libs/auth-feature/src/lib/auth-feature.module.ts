import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';
import { AuthCoreUtilsModule } from '@org/auth-core-utils';

import { AuthFeatureController } from './auth-feature.controller';
import { AuthFeatureService } from './auth-feature.service';

@Module({
  imports: [AuthCoreUtilsModule, AuthCoreModule],
  controllers: [AuthFeatureController],
  providers: [AuthFeatureService],
})
export class AuthFeatureModule {}
