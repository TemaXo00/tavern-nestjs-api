import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { LogsCoreModule } from '@org/logs-core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LogsCoreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
