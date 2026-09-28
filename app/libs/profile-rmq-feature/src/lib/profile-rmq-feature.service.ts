import { Injectable } from '@nestjs/common';
import { ProfileDatabaseUtil } from '@org/profile-utils';
import { AuthRegisteredMessage } from '@org/types';

@Injectable()
export class ProfileRmqFeatureService {
  constructor(private readonly dbUtil: ProfileDatabaseUtil) {}

  async handleUserRegistered(payload: AuthRegisteredMessage): Promise<void> {
    await this.dbUtil.createProfile(payload);
  }
}
