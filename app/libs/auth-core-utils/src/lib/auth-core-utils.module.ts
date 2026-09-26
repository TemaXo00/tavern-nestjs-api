import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthDatabaseModule } from '@org/auth-database';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthCoreAuthorizeUtil } from './utils/auth.util';
import { AuthCoreCacheUtil } from './utils/cache.util';
import { AuthCoreDatabaseUtil } from './utils/database.util';
import { AuthCoreJWTUtil } from './utils/jwt.util';
import { AuthCoreValidateUtil } from './utils/validate.util';

const UTILS = [
  AuthCoreAuthorizeUtil,
  AuthCoreCacheUtil,
  AuthCoreJWTUtil,
  AuthCoreDatabaseUtil,
  AuthCoreValidateUtil,
];

@Module({
  imports: [
    AuthDatabaseModule,
    SharedUtilsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(
          'TAVERN_JWT_SECRET',
          'DEFAULT_JWT_SECRET_DONT_USE_IN_PRODUCTION',
        ),
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
          password: config.get<string>('TAVERN_REDIS_PASSWORD', '123456'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class AuthCoreUtilsModule {}
