import { Injectable } from '@nestjs/common';
import { GRPC_TO_ROLE, UserEntity, UserEntityGateway } from '@org/types';

@Injectable()
export class GatewayMapService {
  mapUser(user: UserEntity): UserEntityGateway {
    return {
      ...user,
      role: GRPC_TO_ROLE[user.role],
    };
  }
}
