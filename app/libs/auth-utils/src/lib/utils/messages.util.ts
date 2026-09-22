import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  AdminBlockUserLog,
  AdminBlockUserProfile,
  AdminCheckTokensMessage,
  AdminDeleteInactiveTokensMessage,
  AdminDeleteTokenMessage,
  AdminDemoteUserMessage,
  AdminGetTokenByIdMessage,
  AdminPromoteUserMessage,
  AdminSetTokenRevokedMessage,
  AdminSetUserActiveMessage,
  AdminUnblockUserMessage,
  AuthForgotPasswordMessage,
  AuthLogForgotPassword,
  AuthLoginMessage,
  AuthLogoutMessage,
  AuthMailForgotPassword,
  AUTHORIZATION_MESSAGES,
  AuthRegisteredMessage,
  AuthRestorePasswordMessage,
  SESSION_MESSAGES,
  SessionCheckByAdminMessage,
  TOKEN_MESSAGES,
  USER_MESSAGES,
  UserByIdAdminCheckMessage,
  UserChangeEmailMessage,
  UserChangePasswordMessage,
  UserRemoveAllSessionsMessage,
  UserRemoveSessionMessage,
  UserSetInactiveMessage,
  UserUpdatedSessionNameMessage,
  UsersCheckByAdminMessage,
} from "@org/types";

@Injectable()
export class AuthMessagesUtil {
  constructor(
    @Inject('PROFILE_CLIENT') private readonly profile: ClientProxy,
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('MAIL_CLIENT') private readonly mail: ClientProxy,
  ) {}

  // AUTHORIZATION

  sendUserRegisterMessage(data: AuthRegisteredMessage): void {
    this.profile.emit(AUTHORIZATION_MESSAGES.REGISTER, data);
    this.log.emit(AUTHORIZATION_MESSAGES.REGISTER, data);
    this.mail.emit(AUTHORIZATION_MESSAGES.REGISTER, data);
  }

  sendUserLoginMessage(data: AuthLoginMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.LOGIN, data);
    this.log.emit(AUTHORIZATION_MESSAGES.LOGIN, data);
  }

  sendUserLogoutMessage(data: AuthLogoutMessage): void {
    this.log.emit(AUTHORIZATION_MESSAGES.LOGOUT, data);
  }

  sendUserForgotPasswordMessage(data: AuthForgotPasswordMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD, { email: data.email, token: data.token } as AuthMailForgotPassword);
    this.log.emit(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD, { email: data.email, tokenHash: data.tokenHash } as AuthLogForgotPassword);
  }

  sendUserRestorePassword(data: AuthRestorePasswordMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD, data);
    this.log.emit(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD, data);
  }

  // SESSION

  sendAdminCheckUserSessions(data: SessionCheckByAdminMessage): void {
    this.log.emit(SESSION_MESSAGES.CHECK, data);
  }

  sendUserChangeLocalSessionName(data: UserUpdatedSessionNameMessage): void {
    this.log.emit(SESSION_MESSAGES.CHANGE_NAME, data);
  }

  sendUserDeleteSession(data: UserRemoveSessionMessage): void {
    this.log.emit(SESSION_MESSAGES.DELETE, data);
  }

  sendUserDeleteAllSessions(data: UserRemoveAllSessionsMessage): void {
    this.log.emit(SESSION_MESSAGES.ALL_DELETE, data);
  }

  // TOKEN

  sendAdminCheckTokens(data: AdminCheckTokensMessage): void {
    this.log.emit(TOKEN_MESSAGES.CHECK, data);
  }

  sendAdminGetToken(data: AdminGetTokenByIdMessage): void {
    this.log.emit(TOKEN_MESSAGES.BY_ID, data);
  }

  sendAdminRevokeToken(data: AdminSetTokenRevokedMessage): void {
    this.log.emit(TOKEN_MESSAGES.REVOKE, data);
  }

  sendAdminDeleteToken(data: AdminDeleteTokenMessage): void {
    this.log.emit(TOKEN_MESSAGES.DELETE_ONE, data);
  }

  sendAdminDeleteInactiveTokens(data: AdminDeleteInactiveTokensMessage): void {
    this.log.emit(TOKEN_MESSAGES.INACTIVE_DELETE, data);
  }

  // USER

  sendAdminCheckUsers(data: UsersCheckByAdminMessage): void {
    this.log.emit(USER_MESSAGES.CHECK, data);
  }

  sendAdminGetUser(data: UserByIdAdminCheckMessage): void {
    this.log.emit(USER_MESSAGES.BY_ID, data);
  }

  sendAdminBlockUser(data: AdminBlockUserLog): void {
    this.log.emit(USER_MESSAGES.BLOCK, data);
    this.profile.emit(USER_MESSAGES.BLOCK, data as AdminBlockUserProfile);
    this.mail.emit(USER_MESSAGES.BLOCK, data);
  }

  sendAdminUnblockUser(data: AdminUnblockUserMessage): void {
    this.log.emit(USER_MESSAGES.UNBLOCK, data);
    this.profile.emit(USER_MESSAGES.UNBLOCK, data);
    this.mail.emit(USER_MESSAGES.UNBLOCK, data);
  }

  sendAdminPromoteUser(data: AdminPromoteUserMessage): void {
    this.log.emit(USER_MESSAGES.PROMOTE, data);
    this.profile.emit(USER_MESSAGES.PROMOTE, data);
    this.mail.emit(USER_MESSAGES.PROMOTE, data);
  }

  sendAdminDemoteUser(data: AdminDemoteUserMessage): void {
    this.log.emit(USER_MESSAGES.DEMOTE, data);
    this.profile.emit(USER_MESSAGES.DEMOTE, data);
    this.mail.emit(USER_MESSAGES.DEMOTE, data);
  }

  sendUserChangeEmail(data: UserChangeEmailMessage): void {
    this.log.emit(USER_MESSAGES.EMAIL_CHANGE, data);
    this.profile.emit(USER_MESSAGES.EMAIL_CHANGE, data);
    this.mail.emit(USER_MESSAGES.EMAIL_CHANGE, data);
  }

  sendUserChangePassword(data: UserChangePasswordMessage): void {
    this.log.emit(USER_MESSAGES.PASSWORD, data);
    this.mail.emit(USER_MESSAGES.PASSWORD, data);
  }

  sendUserSetInactive(data: UserSetInactiveMessage): void {
    this.log.emit(USER_MESSAGES.SET_INACTIVE, data);
    this.profile.emit(USER_MESSAGES.SET_INACTIVE, data);
    this.mail.emit(USER_MESSAGES.SET_INACTIVE, data);
  }

  sendAdminSetUserActive(data: AdminSetUserActiveMessage): void {
    this.log.emit(USER_MESSAGES.SET_ACTIVE, data);
    this.profile.emit(USER_MESSAGES.SET_ACTIVE, data);
    this.mail.emit(USER_MESSAGES.SET_ACTIVE, data);
  }
}
