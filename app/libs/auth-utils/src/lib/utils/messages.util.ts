import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AdminCheckTokensMessage, AdminDeleteInactiveTokensMessage, AdminDeleteTokenMessage, AdminGetTokenByIdMessage, AdminSetTokenRevokedMessage, AuthForgotPasswordMessage, AuthLogForgotPassword, AuthLoginMessage, AuthLogoutMessage, AuthMailForgotPassword, AUTHORIZATION_MESSAGES, AuthRegisteredMessage, AuthRestorePasswordMessage, SESSION_MESSAGES, SessionCheckByAdminMessage, TOKEN_MESSAGES, UserRemoveAllSessionsMessage, UserRemoveSessionMessage, UserUpdatedSessionNameMessage } from "@org/types";

@Injectable()
export class AuthMessagesUtil {
  constructor(
    @Inject('PROFILE_CLIENT') private readonly profile: ClientProxy,
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('MAIL_CLIENT') private readonly mail: ClientProxy
  ) {}

  sendUserRegisterMessage(data: AuthRegisteredMessage): void {
    this.profile.emit(AUTHORIZATION_MESSAGES.REGISTER, data)
    this.log.emit(AUTHORIZATION_MESSAGES.REGISTER, data)
    this.mail.emit(AUTHORIZATION_MESSAGES.REGISTER, data)
  }

  sendUserLoginMessage(data: AuthLoginMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.LOGIN, data)
    this.log.emit(AUTHORIZATION_MESSAGES.LOGIN, data)
  }

  sendUserLogoutMessage(data: AuthLogoutMessage): void {
    this.log.emit(AUTHORIZATION_MESSAGES.LOGOUT, data)
  }

  sendUserForgotPasswordMessage(data: AuthForgotPasswordMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD, {email: data.email, token: data.token} as AuthMailForgotPassword)
    this.log.emit(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD, {email: data.email, tokenHash: data.tokenHash} as AuthLogForgotPassword)
  }

  sendUserRestorePassword(data: AuthRestorePasswordMessage): void {
    this.mail.emit(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD, data)
    this.log.emit(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD, data)
  }

  sendAdminCheckUserSessions(data: SessionCheckByAdminMessage): void {
    this.log.emit(SESSION_MESSAGES.CHECK, data)
  }

  sendUserChangeLocalSessionName(data: UserUpdatedSessionNameMessage): void {
    this.log.emit(SESSION_MESSAGES.CHANGE_NAME, data)
  }

  sendUserDeleteSession(data: UserRemoveSessionMessage): void {
    this.log.emit(SESSION_MESSAGES.DELETE, data)
  }

  sendUserDeleteAllSessions(data: UserRemoveAllSessionsMessage): void {
    this.log.emit(SESSION_MESSAGES.ALL_DELETE, data)
  }

  sendAdminCheckTokens(data: AdminCheckTokensMessage): void {
    this.log.emit(TOKEN_MESSAGES.CHECK, data)
  }

  sendAdminGetToken(data: AdminGetTokenByIdMessage): void {
    this.log.emit(TOKEN_MESSAGES.BY_ID, data)
  }

  sendAdminRevokeToken(data: AdminSetTokenRevokedMessage): void {
    this.log.emit(TOKEN_MESSAGES.REVOKE, data)
  }

  sendAdminDeleteToken(data: AdminDeleteTokenMessage): void {
    this.log.emit(TOKEN_MESSAGES.DELETE_ONE, data)
  }

  sendAdminDeleteInactiveTokens(data: AdminDeleteInactiveTokensMessage): void {
    this.log.emit(TOKEN_MESSAGES.INACTIVE_DELETE, data)
  }
}
