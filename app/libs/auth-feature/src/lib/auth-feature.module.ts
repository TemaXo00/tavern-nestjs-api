import { Module } from '@nestjs/common';

import { AuthFeatureController } from './auth-feature.controller';
import { AuthFeatureService } from './auth-feature.service';

@Module({
  controllers: [AuthFeatureController],
  providers: [AuthFeatureService],
})
export class AuthFeatureModule {}
