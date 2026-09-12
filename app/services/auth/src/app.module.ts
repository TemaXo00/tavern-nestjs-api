import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthCoreModule } from '@org/auth-core';
import { AuthDatabaseModule } from '@org/auth-database'
import { AuthFeatureModule } from '@org/auth-feature'
import { AuthUtilsModule } from '@org/auth-utils';
import { SessionFeatureModule } from '@org/session-feature'
import { TokenFeatureModule } from '@org/token-feature'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthUtilsModule,
    AuthCoreModule,
    AuthDatabaseModule,
    AuthFeatureModule,
    SessionFeatureModule,
    TokenFeatureModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
