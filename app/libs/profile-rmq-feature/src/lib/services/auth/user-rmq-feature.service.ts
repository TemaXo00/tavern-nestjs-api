import { Injectable } from '@nestjs/common';
import { Actions } from '@org/profile-database';
import { ProfileDatabaseUtil, ProfileReputationUtil } from '@org/profile-utils';
import { AdminBlockUserProfile } from '@org/types';

@Injectable()
export class UserRmqFeatureService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly reputationUtil: ProfileReputationUtil,
  ) {}

  async handleUserBlock(data: AdminBlockUserProfile): Promise<void> {
    await this.dbUtil.blockUser(
      data,
      this.reputationUtil.getScore(Actions.BLOCK),
    );
  }
}
