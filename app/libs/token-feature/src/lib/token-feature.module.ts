import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';

import { TokenFeatureController } from './token-feature.controller';
import { TokenFeatureService } from './token-feature.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [TokenFeatureController],
  providers: [TokenFeatureService],
})
export class TokenFeatureModule {}
