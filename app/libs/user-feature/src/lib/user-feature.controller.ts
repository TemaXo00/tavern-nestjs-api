import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { UserFeatureService } from "./user-feature.service";

import type { BlockUserInput, ChangeEmailInput, ChangePasswordInput, ChangeUserToActiveInput, DemoteFromModeratorInput, Empty, GetAllUsersInput, GetUserByIdInput, PaginatedUserOutput, PromoteToModeratorInput, SetUserInactiveInput, UnblockUserInput, UserOutput, UserServiceContract } from "@org/types";

@Controller()
export class UserFeatureController implements UserServiceContract {

  constructor(private readonly service: UserFeatureService) {}

  @GrpcMethod('UserService', 'GetAllUsers')
  async GetAllUsers(data: GetAllUsersInput): Promise<PaginatedUserOutput> {
    return await this.service.GetAllUsers(data)
  }

  @GrpcMethod('UserService', 'GetUserById')
  async GetUserById(data: GetUserByIdInput): Promise<UserOutput> {
    return await this.service.GetUserById(data)
  }

  BlockUser(data: BlockUserInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  UnblockUser(data: UnblockUserInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  PromoteToModerator(data: PromoteToModeratorInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  DemoteFromModerator(data: DemoteFromModeratorInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  ChangeEmail(data: ChangeEmailInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  ChangePassword(data: ChangePasswordInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }
  SetUserInactive(data: SetUserInactiveInput): Promise<Empty> {
    throw new Error("Method not implemented.");
  }
  ChangeUserToActive(data: ChangeUserToActiveInput): Promise<UserOutput> {
    throw new Error("Method not implemented.");
  }

}
