import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices'

import type { AuthLogForgotPassword, AuthLoginMessage, AuthLogoutMessage, AuthRegisteredMessage, AuthRestorePasswordMessage } from '@org/types'

@Controller()
export class LogsAuthController {
  private readonly logger = new Logger('Test');

  @MessagePattern('user.registered')
  userRegistered(@Payload() data: AuthRegisteredMessage): void {
    this.logger.log(JSON.stringify(data))
  }

  @MessagePattern('user.login')
  userLoggedIn(@Payload() data: AuthLoginMessage): void {
    this.logger.log(JSON.stringify(data))
  }

  @MessagePattern('user.logout')
  userLoggedOut(@Payload() data: AuthLogoutMessage): void {
    this.logger.log(JSON.stringify(data))
  }

  @MessagePattern('user.forgot.password')
  userForgotPassword(@Payload() data: AuthLogForgotPassword): void {
    this.logger.log(JSON.stringify(data))
  }

  @MessagePattern('user.restore.password')
  userRestoredPassword(@Payload() data: AuthRestorePasswordMessage): void {
    this.logger.log(JSON.stringify(data))
  }
}
