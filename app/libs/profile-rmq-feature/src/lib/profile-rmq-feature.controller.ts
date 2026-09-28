import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AUTHORIZATION_MESSAGES, type AuthRegisteredMessage } from '@org/types';

import { ProfileRmqFeatureService } from './profile-rmq-feature.service';

@Controller()
export class ProfileRmqFeatureController {
  constructor(private readonly service: ProfileRmqFeatureService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async register(@Payload() payload: AuthRegisteredMessage): Promise<void> {
    await this.service.handleUserRegistered(payload);
  }
}
