import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { UserFeatureService } from "./user-feature.service";

import type {
  BlockUserInput,
  ChangeEmailInput,
  ChangePasswordInput,
  ChangeUserToActiveInput,
  DemoteFromModeratorInput,
  Empty,
  GetAllUsersInput,
  GetUserByIdInput,
  PaginatedUserOutput,
  PromoteToModeratorInput,
  SetUserInactiveInput,
  UnblockUserInput,
  UserOutput,
  UserServiceContract,
} from "@org/types";

@Controller()
export class UserFeatureController implements UserServiceContract {
  constructor(private readonly service: UserFeatureService) {}

  @GrpcMethod('UserService', 'GetAllUsers')
  async GetAllUsers(data: GetAllUsersInput): Promise<PaginatedUserOutput> {
    return await this.service.GetAllUsers(data);
  }

  @GrpcMethod('UserService', 'GetUserById')
  async GetUserById(data: GetUserByIdInput): Promise<UserOutput> {
    return await this.service.GetUserById(data);
  }

  @GrpcMethod('UserService', 'BlockUser')
  async BlockUser(data: BlockUserInput): Promise<UserOutput> {
    return await this.service.BlockUser(data);
  }

  @GrpcMethod('UserService', 'UnblockUser')
  async UnblockUser(data: UnblockUserInput): Promise<UserOutput> {
    return await this.service.UnblockUser(data);
  }

  @GrpcMethod('UserService', 'PromoteToModerator')
  async PromoteToModerator(data: PromoteToModeratorInput): Promise<UserOutput> {
    return await this.service.PromoteToModerator(data);
  }

  @GrpcMethod('UserService', 'DemoteFromModerator')
  async DemoteFromModerator(data: DemoteFromModeratorInput): Promise<UserOutput> {
    return await this.service.DemoteFromModerator(data);
  }

  @GrpcMethod('UserService', 'ChangeEmail')
  async ChangeEmail(data: ChangeEmailInput): Promise<UserOutput> {
    return await this.service.ChangeEmail(data);
  }

  @GrpcMethod('UserService', 'ChangePassword')
  async ChangePassword(data: ChangePasswordInput): Promise<UserOutput> {
    return await this.service.ChangePassword(data);
  }

  @GrpcMethod('UserService', 'SetUserInactive')
  async SetUserInactive(data: SetUserInactiveInput): Promise<Empty> {
    return await this.service.SetUserInactive(data);
  }

  @GrpcMethod('UserService', 'ChangeUserToActive')
  async ChangeUserToActive(data: ChangeUserToActiveInput): Promise<UserOutput> {
    return await this.service.ChangeUserToActive(data);
  }
}
