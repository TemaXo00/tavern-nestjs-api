import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileRmqFeatureModule } from '@org/profile-rmq-feature';
import { ProfileUtilsModule } from '@org/profile-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileUtilsModule,
    ProfileRmqFeatureModule,
  ],
})
export class AppModule {}
