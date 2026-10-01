import { Injectable } from '@nestjs/common';
import { ProfileDatabaseUtil } from '@org/profile-utils';
import { RmqLoggerUtil } from '@org/shared-utils';
import { AUTHORIZATION_MESSAGES, AuthRegisteredMessage } from '@org/types';

@Injectable()
export class AuthRmqFeatureService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private logUtil: RmqLoggerUtil,
  ) {}

  async handleUserRegistered(payload: AuthRegisteredMessage): Promise<void> {
    await this.dbUtil.createProfile(payload);
    this.logUtil.logSuccess(
      'Create Profile',
      AUTHORIZATION_MESSAGES.REGISTER,
      `userId: ${payload.id}`,
    );
  }
}
