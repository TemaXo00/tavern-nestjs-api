import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AUTHORIZATION_MESSAGES, type AuthRegisteredMessage } from '@org/types';

import { AuthRmqFeatureService } from './services/auth/auth-rmq-feature.service';

@Controller()
export class ProfileRmqFeatureController {
  constructor(private readonly auth: AuthRmqFeatureService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async register(@Payload() payload: AuthRegisteredMessage): Promise<void> {
    await this.auth.handleUserRegistered(payload);
  }
}
