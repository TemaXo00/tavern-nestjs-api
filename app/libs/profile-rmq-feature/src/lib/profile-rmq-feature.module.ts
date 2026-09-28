import { Module } from '@nestjs/common';
import { ProfileUtilsModule } from '@org/profile-utils';

@Module({
  imports: [ProfileUtilsModule],
  controllers: [],
  providers: [],
})
export class ProfileRmqFeatureModule {}
