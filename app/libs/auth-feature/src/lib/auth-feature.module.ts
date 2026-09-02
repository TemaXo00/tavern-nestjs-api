import { Module } from '@nestjs/common';
import { AuthUtilsModule } from '@org/auth-utils'

import { AuthFeatureController } from './auth-feature.controller';
import { AuthFeatureService } from './auth-feature.service';
import { AuthValidateService } from './auth-validate.service';

@Module({
  imports: [
    AuthUtilsModule
  ],
  controllers: [AuthFeatureController],
  providers: [AuthFeatureService, AuthValidateService],
  exports: [AuthValidateService],
})
export class AuthFeatureModule {}
