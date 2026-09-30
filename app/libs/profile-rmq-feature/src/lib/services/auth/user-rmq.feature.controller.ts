import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { type AdminBlockUserProfile, USER_MESSAGES } from '@org/types';

import { UserRmqFeatureService } from './user-rmq-feature.service';

@Controller()
export class UserRmqFeatureController {
  constructor(private readonly service: UserRmqFeatureService) {}

  @EventPattern(USER_MESSAGES.BLOCK)
  async blockUser(@Payload() payload: AdminBlockUserProfile): Promise<void> {
    await this.service.handleUserBlock(payload);
  }
}
