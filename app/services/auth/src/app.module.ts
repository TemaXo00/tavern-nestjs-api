import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDatabaseModule } from '@org/auth-database'
import { AuthFeatureModule } from '@org/auth-feature'
import { SessionFeatureModule } from '@org/session-feature'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthDatabaseModule,
    AuthFeatureModule,
    SessionFeatureModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
