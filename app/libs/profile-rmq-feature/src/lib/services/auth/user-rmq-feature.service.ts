import { Injectable } from '@nestjs/common';
import { Actions } from '@org/profile-database';
import { ProfileDatabaseUtil, ProfileReputationUtil } from '@org/profile-utils';
import { RmqLoggerUtil } from '@org/shared-utils';
import { AdminBlockUserProfile, USER_MESSAGES } from '@org/types';

@Injectable()
export class UserRmqFeatureService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly reputationUtil: ProfileReputationUtil,
    private readonly logUtil: RmqLoggerUtil,
  ) {}

  async handleUserBlock(data: AdminBlockUserProfile): Promise<void> {
    await this.dbUtil.blockUser(
      data,
      this.reputationUtil.getScore(Actions.BLOCK),
    );
    this.logUtil.logSuccess(
      UserRmqFeatureService.name,
      USER_MESSAGES.BLOCK,
      `User with id ${data.userId}. Block reason: ${data.blockReason}. Blocked until: ${data.blockedUntil}`,
    );
  }
}
