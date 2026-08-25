import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { OrgTasksFeatureModule } from '@org/tasks-feature'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrgTasksFeatureModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
