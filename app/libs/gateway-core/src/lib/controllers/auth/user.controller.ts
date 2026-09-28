import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  BlockUserDto,
  ChangeEmailDto,
  ChangePasswordDto,
  DeleteUserDto,
  UserPaginationDto,
} from '@org/dto';
import {
  type PaginatedUserGatewayOutput,
  Roles,
  UserGatewayOutput,
  UserServiceObservableContract,
  type ValidateInput,
} from '@org/types';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { DELETEProtectedMethod } from '../../decorators/methods/delete-method.decorator';
import { GETProtectedMethod } from '../../decorators/methods/get-method.decorator';
import { PATCHProtectedMethod } from '../../decorators/methods/patch-method.decorator';
import { QUERYProtectedMethod } from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { AuthGatewayMapService } from '../../services/map/auth-map.service';

import type { ClientGrpc } from '@nestjs/microservices';

@HTTPController({
  microserviceName: 'Auth',
  serviceName: 'User',
})
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
    roles: [Roles.ADMIN, Roles.MODERATOR],
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

  @GETProtectedMethod({
    path: ':id',
    operationDesc: 'Get User by ID',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getUserById(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.GetUserById({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: 'me/email',
    operationDesc: 'Change email',
  })
  async changeEmail(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ChangeEmailDto,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangeEmail({ validation, ...dto }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: 'me/password',
    operationDesc: 'Change password',
  })
  async changePassword(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ChangePasswordDto,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangePassword({ validation, ...dto }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: 'me/inactive',
    operationDesc: 'Set user inactive',
  })
  async setInactive(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(this.userContract.SetUserInactive({ validation }));
  }

  @PATCHProtectedMethod({
    path: ':id/block',
    operationDesc: 'Block user by ID. Need to setup blocked until and reason',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async blockUser(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: BlockUserDto,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.BlockUser({
        id,
        validation,
        ...dto,
      }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/unblock',
    operationDesc: 'Unblock user',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async unblockUser(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.UnblockUser({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/promote',
    operationDesc: 'Promote user to moderator',
    roles: [Roles.ADMIN],
  })
  async promoteUser(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.PromoteToModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/demote',
    operationDesc: 'Demote moderator to user',
    roles: [Roles.ADMIN],
  })
  async demoteModerator(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.DemoteFromModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/active',
    operationDesc: 'Admin set user as active',
    roles: [Roles.ADMIN],
  })
  async setActive(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<UserGatewayOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangeUserToActive({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @DELETEProtectedMethod({
    path: 'me/delete',
    operationDesc: 'Delete current user with all relations',
  })
  async deleteUser(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: DeleteUserDto,
  ): Promise<void> {
    await firstValueFrom(
      this.userContract.DeleteUser({ validation, password: dto.password }),
    );
  }
}
