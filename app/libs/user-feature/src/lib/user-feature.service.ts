import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-core';
import {
  AuthCoreCacheUtil,
  AuthCoreDatabaseUtil,
  AuthCoreValidateUtil,
} from '@org/auth-core-utils';
import {
  AuthDatabaseUtil,
  AuthMapUtil,
  AuthMessagesUtil,
  AuthPasswordUtil,
  AuthValidateUtil,
} from '@org/auth-utils';
import {
  GRPC_TO_ROLE,
  Roles,
  UserDeleteInput,
  type BlockUserInput,
  type ChangeEmailInput,
  type ChangePasswordInput,
  type ChangeUserToActiveInput,
  type DemoteFromModeratorInput,
  type Empty,
  type GetAllUsersInput,
  type GetUserByIdInput,
  type PaginatedUserOutput,
  type PromoteToModeratorInput,
  type SetUserInactiveInput,
  type UnblockUserInput,
  type UserOutput,
  type UserServiceContract,
} from '@org/types';

@Injectable()
export class UserFeatureService implements UserServiceContract {
  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil,
    private readonly mapUtil: AuthMapUtil,
    private readonly passwordUtil: AuthPasswordUtil,
    private readonly messagesUtil: AuthMessagesUtil,
    private readonly validation: AuthValidateService,
    private readonly cacheUtil: AuthCoreCacheUtil,
    private readonly validateCoreUtil: AuthCoreValidateUtil,
    private readonly dbCoreUtil: AuthCoreDatabaseUtil,
  ) {}

  async GetAllUsers(data: GetAllUsersInput): Promise<PaginatedUserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const response = await this.dbUtil.getPaginatedUsers(data.pagination);
    this.messagesUtil.sendAdminCheckUsers({
      adminId: payload.id,
      query: data.pagination,
    });
    return response;
  }

  async GetUserById(data: GetUserByIdInput): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const user = await this.validateUtil.validateUserExists(data.id);
    this.messagesUtil.sendAdminGetUser({
      adminId: payload.id,
      userId: user.id,
    });
    return this.mapUtil.mapUser(user);
  }

  async BlockUser(data: BlockUserInput): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const user = await this.validateUtil.validateUserExists(data.id);
    this.validateUtil.validateBlockDate(data.blockedUntil);
    this.validateUtil.validateUserCanChangeStatus(
      GRPC_TO_ROLE[payload.role],
      user.role as Roles,
    );
    await this.validateCoreUtil.validateUserBlock(
      user.id,
      user.isBlocked,
      user.blockedUntil,
      user.blockReason,
    );
    await this.cacheUtil.delAllPayloads(user.id);
    const blockedUser = await this.dbUtil.blockUser(
      user.id,
      data.blockedUntil,
      data.blockReason,
    );
    this.messagesUtil.sendAdminBlockUser({
      adminId: payload.id,
      userId: user.id,
      blockReason: data.blockReason,
      blockedFrom: new Date(),
      blockedUntil: data.blockedUntil,
    });
    return this.mapUtil.mapUser(blockedUser);
  }

  async UnblockUser(data: UnblockUserInput): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const user = await this.validateUtil.validateUserExists(data.id);
    this.validateUtil.validateUserCanChangeStatus(
      GRPC_TO_ROLE[payload.role],
      user.role as Roles,
    );
    this.validateUtil.validateUserNotBlocked(user.isBlocked);
    const unblockedUser = await this.dbCoreUtil.unblockUser(user.id);
    await this.cacheUtil.delAllPayloads(user.id);
    this.messagesUtil.sendAdminUnblockUser({
      adminId: payload.id,
      userId: user.id,
    });
    return this.mapUtil.mapUser(unblockedUser);
  }

  async PromoteToModerator(data: PromoteToModeratorInput): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    await this.validateUtil.validateUserCanBePromoted(data.id);
    const newModerator = await this.dbUtil.changeUserRole(
      data.id,
      Roles.MODERATOR,
    );
    await this.cacheUtil.delAllPayloads(newModerator.id);
    this.messagesUtil.sendAdminPromoteUser({
      adminId: payload.id,
      userId: newModerator.id,
    });
    return this.mapUtil.mapUser(newModerator);
  }

  async DemoteFromModerator(
    data: DemoteFromModeratorInput,
  ): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    const user = await this.validateUtil.validateUserExists(data.id);
    this.validateUtil.validateUserModerator(user.role as Roles);
    const demotedUser = await this.dbUtil.changeUserRole(data.id, Roles.USER);
    await this.cacheUtil.delAllPayloads(demotedUser.id);
    this.messagesUtil.sendAdminDemoteUser({
      adminId: payload.id,
      userId: user.id,
    });
    return this.mapUtil.mapUser(demotedUser);
  }

  async ChangeEmail(data: ChangeEmailInput): Promise<UserOutput> {
    const payload = await this.validation.Validate(data.validation);
    const user = await this.validateUtil.validateUserExists(payload.id);
    await this.validateUtil.validateEmailNotExists(data.newEmail);
    await this.cacheUtil.delAllPayloads(user.id);
    const updatedUser = await this.dbUtil.updateUserEmail(
      user.id,
      data.newEmail,
    );
    this.messagesUtil.sendUserChangeEmail({
      userId: payload.id,
      session: data.validation.session,
      newEmail: data.newEmail,
    });
    return this.mapUtil.mapUser(updatedUser);
  }

  async ChangePassword(data: ChangePasswordInput): Promise<UserOutput> {
    const payload = await this.validation.Validate(data.validation);
    const user = await this.validateUtil.validateUserExists(payload.id);
    this.passwordUtil.validatePasswordInput(
      data.newPassword,
      data.newPasswordConfirmation,
    );
    await this.passwordUtil.validatePassword(
      user.passwordHash,
      data.oldPassword,
      'Invalid password',
      status.ABORTED,
    );
    const hashedPassword = await this.passwordUtil.hashPassword(
      data.newPassword,
    );
    await this.dbUtil.updateUserPassword(user.email, hashedPassword);
    await this.dbCoreUtil.removeAllSessions(user.id);
    await this.cacheUtil.delAllPayloads(user.id);
    this.messagesUtil.sendUserChangePassword({
      userId: payload.id,
      session: data.validation.session,
    });
    return this.mapUtil.mapUser(user);
  }

  async SetUserInactive(data: SetUserInactiveInput): Promise<Empty> {
    const payload = await this.validation.Validate(data.validation);
    await this.dbUtil.setUserInactive(payload.id);
    await this.dbCoreUtil.removeAllSessions(payload.id);
    await this.cacheUtil.delAllPayloads(payload.id);
    this.messagesUtil.sendUserSetInactive({ userId: payload.id });
    return {};
  }

  async ChangeUserToActive(data: ChangeUserToActiveInput): Promise<UserOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    const user = await this.validateUtil.validateUserExists(data.id);
    const updatedUser = await this.dbUtil.setUserActive(user.id);
    await this.cacheUtil.delAllPayloads(user.id);
    this.messagesUtil.sendAdminSetUserActive({
      adminId: payload.id,
      userId: user.id,
    });
    return this.mapUtil.mapUser(updatedUser);
  }

  async DeleteUser(data: UserDeleteInput): Promise<void> {
    const payload = await this.validation.Validate(data.validation);
    const user = await this.validateUtil.validateUserExists(payload.id);
    await this.passwordUtil.validatePassword(
      user.passwordHash,
      data.password,
      'Invalid password',
      status.CANCELLED,
    );
    await this.cacheUtil.delAllPayloads(user.id);
    await this.dbUtil.removeUser(user.id, user.email);
    this.messagesUtil.sendUserDeleted({ userId: user.id, email: user.email });
  }
}
