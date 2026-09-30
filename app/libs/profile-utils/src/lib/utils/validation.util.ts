import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Profile } from '@org/profile-database';

import { ProfileDatabaseUtil } from './database.util';
import { SearchUserHelperType } from './helpers/types.helper';

@Injectable()
export class ProfileValidationUtil {
  constructor(private readonly db: ProfileDatabaseUtil) {}

  async checkUserExisting(
    type: SearchUserHelperType,
    input: string,
  ): Promise<Profile> {
    const profile = await this.db.getProfile(type, input);

    if (!profile) {
      throw new RpcException({
        message: 'Profile not found',
        code: status.NOT_FOUND,
      });
    }

    return profile;
  }
}
