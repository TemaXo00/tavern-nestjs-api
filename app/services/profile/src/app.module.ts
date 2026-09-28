import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileRmqFeatureModule } from '@org/profile-rmq-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileRmqFeatureModule,
  ],
})
export class AppModule {}
