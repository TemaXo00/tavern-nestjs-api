import { Injectable } from "@nestjs/common";
import { AuthValidateService } from '@org/auth-core'
import { AuthCacheUtil, AuthDatabaseUtil, AuthMapUtil, AuthPasswordUtil, AuthValidateUtil } from '@org/auth-utils'
import { Roles, type BlockUserInput, type ChangeEmailInput, type ChangePasswordInput, type ChangeUserToActiveInput, type DemoteFromModeratorInput, type Empty, type GetAllUsersInput, type GetUserByIdInput, type PaginatedUserOutput, type PromoteToModeratorInput, type SetUserInactiveInput, type UnblockUserInput, type UserOutput, type UserServiceContract } from '@org/types'

@Injectable()
export class UserFeatureService implements UserServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil,
    private readonly mapUtil: AuthMapUtil,
    private readonly cacheUtil: AuthCacheUtil,
    private readonly passwordUtil: AuthPasswordUtil,
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

  async BlockUser(data: BlockUserInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const user = await this.validateUtil.validateUserExists(data.id)
    await this.validateUtil.validateUserBlock(user.id, user.isBlocked, user.blockedUntil, user.blockReason)
    await this.cacheUtil.delAllPayloads(user.id)
    const blockedUser = await this.dbUtil.blockUser(user.id, data.blockedUntil, data.blockReason)
    return this.mapUtil.mapUser(blockedUser)
  }

  async UnblockUser(data: UnblockUserInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const user = await this.validateUtil.validateUserExists(data.id)
    this.validateUtil.validateUserNotBlocked(user.isBlocked)
    const unblockerUser = await this.dbUtil.unblockUser(user.id)
    return this.mapUtil.mapUser(unblockerUser)
  }

  async PromoteToModerator(data: PromoteToModeratorInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateUserCanBePromoted(data.id)
    const newModerator = await this.dbUtil.changeUserRole(data.id, Roles.MODERATOR)
    return this.mapUtil.mapUser(newModerator)
  }

  async DemoteFromModerator(data: DemoteFromModeratorInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const user = await this.validateUtil.validateUserExists(data.id)
    this.validateUtil.validateUserModerator(user.role as Roles)
    const demotedUser = await this.dbUtil.changeUserRole(data.id, Roles.USER)
    return this.mapUtil.mapUser(demotedUser)
  }

  async ChangeEmail(data: ChangeEmailInput): Promise<UserOutput> {
    const payload = await this.validation.Validate(data.validation);
    const user = await this.validateUtil.validateUserExists(payload.id);
    await this.validateUtil.validateEmailNotExists(data.newEmail);
    await this.cacheUtil.delAllPayloads(user.id);
    const updatedUser = await this.dbUtil.updateUserEmail(user.id, data.newEmail);
    return this.mapUtil.mapUser(updatedUser);
  }

  async ChangePassword(data: ChangePasswordInput): Promise<UserOutput> {
    const payload = await this.validation.Validate(data.validation);
    const user = await this.validateUtil.validateUserExists(payload.id);
    this.passwordUtil.validatePasswordInput(data.newPassword, data.newPasswordConfirmation);
    await this.passwordUtil.validatePassword(user.passwordHash, data.oldPassword);
    const hashedPassword = await this.passwordUtil.hashPassword(data.newPassword);
    await this.dbUtil.updateUserPassword(user.email, hashedPassword);
    await this.dbUtil.removeAllSessions(user.id);
    await this.cacheUtil.delAllPayloads(user.id);
    return this.mapUtil.mapUser(user);
  }

  async SetUserInactive(data: SetUserInactiveInput): Promise<Empty> {
    const payload = await this.validation.Validate(data.validation);
    await this.dbUtil.setUserInactive(payload.id);
    await this.dbUtil.removeAllSessions(payload.id);
    await this.cacheUtil.delAllPayloads(payload.id);
    return {};
  }

  async ChangeUserToActive(data: ChangeUserToActiveInput): Promise<UserOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN]);
    const user = await this.validateUtil.validateUserExists(data.id);
    const updatedUser = await this.dbUtil.setUserActive(user.id);
    return this.mapUtil.mapUser(updatedUser);
  }
}
