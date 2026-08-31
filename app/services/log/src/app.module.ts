import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { LogsAuthModule } from '@org/logs-auth'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LogsAuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
