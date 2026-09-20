import { Injectable } from "@nestjs/common";
import { AuthValidateService } from '@org/auth-core'
import { AuthDatabaseUtil, AuthMapUtil, AuthValidateUtil } from '@org/auth-utils'
import { Roles, type BlockUserInput, type ChangeEmailInput, type ChangePasswordInput, type ChangeUserToActiveInput, type DemoteFromModeratorInput, type Empty, type GetAllUsersInput, type GetUserByIdInput, type PaginatedUserOutput, type PromoteToModeratorInput, type SetUserInactiveInput, type UnblockUserInput, type UserOutput, type UserServiceContract } from '@org/types'

@Injectable()
export class UserFeatureService implements UserServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil,
    private readonly mapUtil: AuthMapUtil,
    private readonly validation: AuthValidateService
  ) { }

  async GetAllUsers(data: GetAllUsersInput): Promise<PaginatedUserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    return await this.dbUtil.getPaginatedUsers(data.pagination)
  }

  async GetUserById(data: GetUserByIdInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const user = await this.validateUtil.validateUserExists(data.id)
    return this.mapUtil.mapUser(user)
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
