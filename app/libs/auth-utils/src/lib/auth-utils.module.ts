import { Global, Module } from '@nestjs/common';
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices';
import { AuthDatabaseModule } from '@org/auth-database';
import { RmqModule, RmqService } from '@org/rmq-config';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthDatabaseUtil } from './utils/database.util';
import { AuthMapUtil } from './utils/map.util';
import { AuthMessagesUtil } from './utils/messages.util';
import { AuthPasswordUtil } from './utils/password.util';
import { AuthTokenUtil } from './utils/token.util';
import { AuthValidateUtil } from './utils/validate.util';

const UTILS = [
  AuthDatabaseUtil,
  AuthMessagesUtil,
  AuthPasswordUtil,
  AuthValidateUtil,
  AuthTokenUtil,
  AuthMapUtil,
];

const queues: string[] = ['profile', 'log', 'mail'];

@Global()
@Module({
  imports: [
    AuthDatabaseModule,
    SharedUtilsModule,
    RmqModule,
    ClientsModule.registerAsync(
      queues.map((queue) => ({
        name: `${queue.toUpperCase()}_CLIENT`,
        imports: [RmqModule],
        useFactory: (rmq: RmqService): ClientProviderOptions => {
          return rmq.getRmqConfig(queue);
        },
        inject: [RmqService],
      })),
    ),
  ],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class AuthUtilsModule {}
