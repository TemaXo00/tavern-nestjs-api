import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AUTHORIZATION_MESSAGES, type AuthRegisteredMessage } from '@org/types';

import { AuthRmqFeatureService } from './auth-rmq-feature.service';

@Controller()
export class AuthRmqFeatureController {
  constructor(private readonly service: AuthRmqFeatureService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async register(@Payload() payload: AuthRegisteredMessage): Promise<void> {
    await this.service.handleUserRegistered(payload);
  }
}
