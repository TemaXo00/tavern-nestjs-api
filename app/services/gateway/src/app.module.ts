import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { OrgGatewayCoreModule } from '@org/gateway-core'

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      OrgGatewayCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
