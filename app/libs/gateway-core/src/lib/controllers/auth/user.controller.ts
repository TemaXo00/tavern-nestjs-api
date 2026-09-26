import { Body, Inject, OnModuleInit } from '@nestjs/common';
import { UserPaginationDto } from '@org/dto';
import {
  type PaginatedUserGatewayOutput,
  Roles,
  UserServiceObservableContract,
  type ValidateInput,
} from '@org/types';
import { firstValueFrom } from 'rxjs';

import { QUERYProtectedMethod } from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { AuthGatewayMapService } from '../../services/map/auth-map.service';

import type { ClientGrpc } from '@nestjs/microservices';

export class UserController implements OnModuleInit {
  private userContract!: UserServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.userContract =
      this.client.getService<UserServiceObservableContract>('UserService');
  }

  @QUERYProtectedMethod({
    path: '',
    operationDesc: 'Returns paginated users. Search using email of users',
    roles: [Roles.ADMIN],
  })
  async getPaginatedUsers(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: UserPaginationDto,
  ): Promise<PaginatedUserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.GetAllUsers({
        validation,
        pagination: this.map.mapUserPaginationRequest(pagination),
      }),
    );
    return {
      pagination: this.map.mapUserPaginationResponse(response.pagination),
      users: this.map.mapAllUsersResponse(response.users),
    };
  }
}
