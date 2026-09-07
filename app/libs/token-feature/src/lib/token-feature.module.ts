import { Module } from '@nestjs/common';
import { AuthFeatureModule } from '@org/auth-feature';
import { AuthUtilsModule } from '@org/auth-utils';

import { TokenFeatureController } from './token-feature.controller';
import { TokenFeatureService } from './token-feature.service';


@Module({
  imports: [
    AuthFeatureModule,
    AuthUtilsModule
  ],
  controllers: [TokenFeatureController],
  providers: [TokenFeatureService],
  exports: [],
})
export class TokenFeatureModule {}
