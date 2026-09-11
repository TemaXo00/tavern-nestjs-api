import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  AUTHORIZATION_MESSAGES,
  type AuthRegisteredMessage,
  type AuthLoginMessage,
  type AuthLogoutMessage,
  type AuthLogForgotPassword,
  type AuthRestorePasswordMessage,
} from '@org/types'

import { LogsCoreService } from "../../logs-core.service";

@Controller()
export class AuthorizationLogsController {
  constructor(private readonly logger: LogsCoreService) { }

  @MessagePattern(AUTHORIZATION_MESSAGES.REGISTER)
  userRegistered(@Payload() data: AuthRegisteredMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(AUTHORIZATION_MESSAGES.LOGIN)
  userLoggedIn(@Payload() data: AuthLoginMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(AUTHORIZATION_MESSAGES.LOGOUT)
  userLoggedOut(@Payload() data: AuthLogoutMessage): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD)
  userForgotPassword(@Payload() data: AuthLogForgotPassword): void {
    this.logger.logMessage(data)
  }

  @MessagePattern(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD)
  userRestoredPassword(@Payload() data: AuthRestorePasswordMessage): void {
    this.logger.logMessage(data)
  }
}
