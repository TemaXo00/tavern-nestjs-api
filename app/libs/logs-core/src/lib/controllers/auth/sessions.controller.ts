import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  SESSION_MESSAGES,
  type SessionCheckByAdminMessage,
  type UserUpdatedSessionNameMessage,
  type UserRemoveSessionMessage,
  type UserRemoveAllSessionsMessage,
} from '@org/types'

import { LogsCoreService } from "../../logs-core.service";

@Controller()
export class SessionLogsController {
  constructor(private readonly logger: LogsCoreService) { }

  @MessagePattern(SESSION_MESSAGES.CHECK)
  adminCheckedSessions(@Payload() data: SessionCheckByAdminMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(SESSION_MESSAGES.CHANGE_NAME)
  userChangedSessionName(@Payload() data: UserUpdatedSessionNameMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(SESSION_MESSAGES.DELETE)
  userDeletedSession(@Payload() data: UserRemoveSessionMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(SESSION_MESSAGES.ALL_DELETE)
  userDeletedAllSessions(@Payload() data: UserRemoveAllSessionsMessage): void {
    this.logger.logMessage(data)
  }
}
