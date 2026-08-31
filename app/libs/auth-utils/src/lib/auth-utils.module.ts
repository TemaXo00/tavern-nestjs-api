import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices';
import { RmqModule, RmqService } from '@org/rmq-config'

import { AuthAuthorizeUtil } from './utils/auth.util';
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
  ],
  controllers: [],
  providers: [
    AuthAuthorizeUtil,
    AuthDatabaseUtil,
    AuthJWTUtil,
    AuthMessagesUtil,
    AuthPasswordUtil,
    AuthValidateUtil,
    AuthTokenUtil
  ],
  exports: [
    AuthAuthorizeUtil,
    AuthDatabaseUtil,
    AuthJWTUtil,
    AuthMessagesUtil,
    AuthPasswordUtil,
    AuthValidateUtil,
    AuthTokenUtil
  ],
})
export class AuthUtilsModule {}
