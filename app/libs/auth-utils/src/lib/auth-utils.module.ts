import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices';
import { RedisModule } from '@nestjs-modules/ioredis'
import { RmqModule, RmqService } from '@org/rmq-config'

import { AuthAuthorizeUtil } from './utils/auth.util';
import { AuthCacheUtil } from './utils/cache.util';
import { AuthDatabaseUtil } from './utils/database.util';
import { AuthJWTUtil } from './utils/jwt.util';
import { AuthMessagesUtil } from './utils/messages.util';
import { AuthPasswordUtil } from './utils/password.util';
import { AuthTokenUtil } from './utils/token.util';
import { AuthValidateUtil } from './utils/validate.util';

const queues: string[] = ['profile', 'log', 'mail']

@Module({
  imports: [
    RmqModule,
    ClientsModule.registerAsync(
      queues.map((queue) => ({
        name: `${queue.toUpperCase()}_CLIENT`,
        imports: [RmqModule],
        useFactory: (rmq: RmqService): ClientProviderOptions => {
          return rmq.getRmqConfig(queue)
        },
        inject: [RmqService]
      }))
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('TAVERN_JWT_SECRET', 'DEFAULT_JWT_SECRET_DONT_USE_IN_PRODUCTION'),
        signOptions: {
          algorithm: 'HS256',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          ignoreExpiration: false,
        },
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('TAVERN_REDIS_URL', 'localhost:6379'),
        options: {
          password: config.get<string>('TAVERN_REDIS_PASSWORD', '123456')
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [
    AuthAuthorizeUtil,
    AuthDatabaseUtil,
    AuthJWTUtil,
    AuthMessagesUtil,
    AuthPasswordUtil,
    AuthValidateUtil,
    AuthTokenUtil,
    AuthCacheUtil
  ],
  exports: [
    AuthAuthorizeUtil,
    AuthDatabaseUtil,
    AuthJWTUtil,
    AuthMessagesUtil,
    AuthPasswordUtil,
    AuthValidateUtil,
    AuthTokenUtil,
    AuthCacheUtil
  ],
})
export class AuthUtilsModule {}
