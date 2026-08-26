import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDatabaseModule } from '@org/auth-database'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthDatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
