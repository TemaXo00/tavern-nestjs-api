import { Injectable } from '@nestjs/common';
import {
  Actions,
  ActivityType,
  type Profile,
  ProfileDatabaseService,
} from '@org/profile-database';
import { RmqLoggerUtil } from '@org/shared-utils';
import {
  AdminBlockUserProfile,
  AdminSetUserActiveMessage,
  AdminUnblockUserMessage,
  AuthRegisteredMessage,
  UserSetInactiveMessage,
} from '@org/types';

import { SearchUserHelperType } from './helpers/types.helper';
import { ProfileUpdateStatusHelper } from './helpers/update-status.helpers';

@Injectable()
export class ProfileDatabaseUtil {
  constructor(
    private readonly db: ProfileDatabaseService,
    private readonly logUtil: RmqLoggerUtil,
    private readonly updateStatusHelper: ProfileUpdateStatusHelper,
  ) {}

  // GET Methods

  async getProfile(
    type: SearchUserHelperType,
    input: string,
  ): Promise<Profile | null> {
    return this.db.profile.findUnique({
      where: type === 'by-id' ? { userId: input } : { nickname: input },
    });
  }

  // CREATE Methods

  async createProfile(data: AuthRegisteredMessage): Promise<void> {
    await this.db.$transaction(async (tx) => {
      async function createActivityLog(profileId: string): Promise<void> {
        await tx.profileActivity.create({
          data: {
            profileId,
            status: ActivityType.ACTIVE,
            message: 'User successfully registered',
          },
        });
      }

      const existing = await tx.profile.findUnique({
        where: { userId: data.id },
        select: {
          id: true,
          activity_logs: {
            where: { message: 'User successfully registered' },
            select: { id: true },
            take: 1,
          },
        },
      });

      if (existing) {
        if (existing.activity_logs.length === 0) {
          this.logUtil.logWarning(
            'CreateProfile',
            'Register',
            'User exists but has no activity log, repairing',
          );
          await createActivityLog(existing.id);
        }
        return;
      }

      const profile = await tx.profile.create({
        data: {
          userId: data.id,
          nickname: data.id,
          email: data.email,
          currentActivity: ActivityType.ACTIVE,
        },
      });
      await createActivityLog(profile.id);
    });
  }

  // UPDATE Methods

  async blockUser(
    data: AdminBlockUserProfile,
    reputationScore: number,
  ): Promise<void> {
    await this.updateStatusHelper.manipulateBlock({
      userId: data.userId,
      searchActivity: ActivityType.ACTIVE,
      updatingActivity: ActivityType.BLOCKED,
      reputationScore,
      action: Actions.BLOCK,
      logMethod: 'Block',
      message: `The user blocked from ${data.blockedFrom.toISOString()} to ${data.blockedUntil.toISOString()}. Reason: ${data.blockReason}`,
    });
  }

  async unblockUser(
    data: AdminUnblockUserMessage,
    reputationScore: number,
  ): Promise<void> {
    await this.updateStatusHelper.manipulateBlock({
      userId: data.userId,
      searchActivity: ActivityType.BLOCKED,
      updatingActivity: ActivityType.ACTIVE,
      reputationScore,
      action: Actions.EARLY_UNBLOCK,
      logMethod: 'Early unblock',
      message: `The user has been unblocked due to changed circumstances.`,
    });
  }

  async activateUser(data: AdminSetUserActiveMessage): Promise<void> {
    await this.updateStatusHelper.manipulateActivity({
      userId: data.userId,
      searchActivity: ActivityType.INACTIVE,
      updatingActivity: ActivityType.ACTIVE,
      logMethod: 'Activate user',
      message: 'The user was activated by the service administrator.',
    });
  }

  async deactivateUser(data: UserSetInactiveMessage): Promise<void> {
    await this.updateStatusHelper.manipulateActivity({
      userId: data.userId,
      searchActivity: ActivityType.ACTIVE,
      updatingActivity: ActivityType.INACTIVE,
      logMethod: 'Deactivate user',
      message: 'The user was deactivated at their own request',
    });
  }

  async updateEmail(userId: string, newEmail: string): Promise<void> {
    await this.db.profile.updateMany({
      where: { userId },
      data: { email: newEmail },
    });
  }

  // DELETE Methods

  async deleteProfile(userId: string): Promise<void> {
    await this.db.profile.deleteMany({
      where: {
        userId,
      },
    });
  }
}
