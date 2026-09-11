import { Module } from '@nestjs/common';

import { AuthorizationLogsController } from './controllers/auth/authorization.controller';
import { SessionLogsController } from './controllers/auth/sessions.controller';
import { TokenLogsController } from './controllers/auth/tokens.controller';
import { LogsCoreService } from './logs-core.service';

const AUTH_CONTROLLERS = [AuthorizationLogsController, SessionLogsController, TokenLogsController ]

@Module({
  controllers: [
    ...AUTH_CONTROLLERS
  ],
  providers: [LogsCoreService],
})
export class LogsCoreModule {}
