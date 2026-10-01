import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  type AdminBlockUserProfile,
  type AdminSetUserActiveMessage,
  type AdminUnblockUserMessage,
  type DeleteUserMessage,
  USER_MESSAGES,
  type UserChangeEmailMessage,
  type UserSetInactiveMessage,
} from '@org/types';

import { UserRmqFeatureService } from './user-rmq-feature.service';

@Controller()
export class UserRmqFeatureController {
  constructor(private readonly service: UserRmqFeatureService) {}

  @EventPattern(USER_MESSAGES.BLOCK)
  async onUserBlock(@Payload() data: AdminBlockUserProfile): Promise<void> {
    await this.service.handleUserBlock(data);
  }

  @EventPattern(USER_MESSAGES.UNBLOCK)
  async onUserUnblock(@Payload() data: AdminUnblockUserMessage): Promise<void> {
    await this.service.handleUserUnblock(data);
  }

  @EventPattern(USER_MESSAGES.SET_INACTIVE)
  async onUserInactive(@Payload() data: UserSetInactiveMessage): Promise<void> {
    await this.service.handleUserInactive(data);
  }

  @EventPattern(USER_MESSAGES.SET_ACTIVE)
  async onUserActive(
    @Payload() data: AdminSetUserActiveMessage,
  ): Promise<void> {
    await this.service.handleUserActive(data);
  }

  @EventPattern(USER_MESSAGES.EMAIL_CHANGE)
  async onUserChangeEmail(
    @Payload() data: UserChangeEmailMessage,
  ): Promise<void> {
    await this.service.handleUserChangeEmail(data);
  }

  @EventPattern(USER_MESSAGES.DELETE)
  async onUserDeleted(@Payload() data: DeleteUserMessage): Promise<void> {
    await this.service.handleUserDeleted(data);
  }
}
