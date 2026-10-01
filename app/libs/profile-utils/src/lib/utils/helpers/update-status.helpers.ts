import { Injectable } from '@nestjs/common';
import { ProfileDatabaseService } from '@org/profile-database';
import { RmqLoggerUtil } from '@org/shared-utils';

import {
  ActivityManipulateOptions,
  BlockManipulateOptions,
} from './types.helper';

@Injectable()
export class ProfileUpdateStatusHelper {
  constructor(
    private readonly db: ProfileDatabaseService,
    private readonly logUtil: RmqLoggerUtil,
  ) {}

  async manipulateBlock(options: BlockManipulateOptions): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const profiles = await tx.profile.updateManyAndReturn({
        where: {
          userId: options.userId,
          currentActivity: options.searchActivity,
        },
        data: {
          currentActivity: options.updatingActivity,
          reputationScore: { increment: options.reputationScore },
        },
      });
      if (profiles.length === 0) {
        this.logUtil.logWarning(
          'Update Status',
          options.logMethod,
          'Cannot find user',
        );
        return;
      }
      const updatedProfile = profiles[0];
      await tx.profileActivity.create({
        data: {
          profileId: updatedProfile.id,
          status: options.updatingActivity,
          message: options.message,
        },
      });
      await tx.reputation.create({
        data: {
          profileId: updatedProfile.id,
          score: options.reputationScore,
          message: options.message,
          action: options.action,
        },
      });
    });
  }

  async manipulateActivity(options: ActivityManipulateOptions): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const profiles = await tx.profile.updateManyAndReturn({
        where: {
          userId: options.userId,
          currentActivity: options.searchActivity,
        },
        data: {
          currentActivity: options.updatingActivity,
        },
      });
      if (profiles.length === 0) {
        this.logUtil.logWarning(
          'Update Activity',
          options.logMethod,
          'Cannot find user',
        );
        return;
      }
      const updatedProfile = profiles[0];
      await tx.profileActivity.create({
        data: {
          profileId: updatedProfile.id,
          status: options.updatingActivity,
          message: options.message,
        },
      });
    });
  }
}
