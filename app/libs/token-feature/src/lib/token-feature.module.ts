import { Module } from '@nestjs/common';

import { TokenFeatureController } from './token-feature.controller';
import { TokenFeatureService } from './token-feature.service';

@Module({
  controllers: [TokenFeatureController],
  providers: [TokenFeatureService],
})
export class TokenFeatureModule {}
