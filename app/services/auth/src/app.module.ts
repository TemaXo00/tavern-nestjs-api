import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthFeatureModule } from '@org/auth-feature';
import { AuthUtilsModule } from '@org/auth-utils';
import { SessionFeatureModule } from '@org/session-feature';
import { TokenFeatureModule } from '@org/token-feature';
import { UserFeatureModule } from '@org/user-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthUtilsModule,
    AuthFeatureModule,
    SessionFeatureModule,
    TokenFeatureModule,
    UserFeatureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
