import { Module } from '@nestjs/common';
import { AuthFeatureModule } from '@org/auth-feature'
import { AuthUtilsModule } from '@org/auth-utils';

@Module({
  imports: [
    AuthFeatureModule,
    AuthUtilsModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SessionFeatureModule {}
