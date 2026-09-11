import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  TOKEN_MESSAGES,
  type AdminCheckTokensMessage,
  type AdminGetTokenByIdMessage,
  type AdminSetTokenRevokedMessage,
  type AdminDeleteTokenMessage,
  type AdminDeleteInactiveTokensMessage,
} from '@org/types'

import { LogsCoreService } from "../../logs-core.service";

@Controller()
export class TokenLogsController {
  constructor(private readonly logger: LogsCoreService) { }

  @MessagePattern(TOKEN_MESSAGES.CHECK)
  adminCheckedTokens(@Payload() data: AdminCheckTokensMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(TOKEN_MESSAGES.BY_ID)
  adminGotToken(@Payload() data: AdminGetTokenByIdMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(TOKEN_MESSAGES.REVOKE)
  adminRevokedToken(@Payload() data: AdminSetTokenRevokedMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(TOKEN_MESSAGES.DELETE_ONE)
  adminDeletedToken(@Payload() data: AdminDeleteTokenMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(TOKEN_MESSAGES.INACTIVE_DELETE)
  adminDeletedInactiveTokens(@Payload() data: AdminDeleteInactiveTokensMessage): void {
    this.logger.logMessage(data)
  }
}
