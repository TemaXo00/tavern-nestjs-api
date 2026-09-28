import { Injectable } from '@nestjs/common';
import {
  ActivityType,
  Profile,
  ProfileDatabaseService,
} from '@org/profile-database';
import { AuthRegisteredMessage } from '@org/types';

@Injectable()
export class ProfileDatabaseUtil {
  constructor(private readonly db: ProfileDatabaseService) {}

  // GET Methods

  async getProfile(
    type: 'by-id' | 'by-nickname',
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
}
