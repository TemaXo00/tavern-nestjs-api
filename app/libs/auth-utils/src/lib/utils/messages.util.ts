import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthForgotPasswordMessage, AuthLogForgotPassword, AuthLoginMessage, AuthLogoutMessage, AuthMailForgotPassword, AuthRegisteredMessage, AuthRestorePasswordMessage, SessionCheckByAdminMessage, UserRemoveAllSessionsMessage, UserRemoveSessionMessage, UserUpdatedSessionNameMessage } from "@org/types";

@Injectable()
export class AuthMessagesUtil {
  constructor(
    @Inject('PROFILE_CLIENT') private readonly profile: ClientProxy,
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('MAIL_CLIENT') private readonly mail: ClientProxy
  ) {}

  sendUserRegisterMessage(data: AuthRegisteredMessage): void {
    const message = 'user.registered'
    this.profile.emit(message, data)
    this.log.emit(message, data)
    this.mail.emit(message, data)
  }

  sendUserLoginMessage(data: AuthLoginMessage): void {
    const message = 'user.login'
    this.mail.emit(message, data)
    this.log.emit(message, data)
  }

  sendUserLogoutMessage(data: AuthLogoutMessage): void {
    const message = 'user.logout'
    this.log.emit(message, data)
  }

  sendUserForgotPasswordMessage(data: AuthForgotPasswordMessage): void {
    const message = 'user.forgot.password'
    this.mail.emit(message, {email: data.email, token: data.token} as AuthMailForgotPassword)
    this.log.emit(message, {email: data.email, tokenHash: data.tokenHash} as AuthLogForgotPassword)
  }

  sendUserRestorePassword(data: AuthRestorePasswordMessage): void {
    const message = 'user.restore.password'
    this.mail.emit(message, data)
    this.log.emit(message, data)
  }

  sendAdminCheckUserSessions(data: SessionCheckByAdminMessage): void {
    const message = 'admin.session.check'
    this.log.emit(message, data)
  }

  sendUserChangeLocalSessionName(data: UserUpdatedSessionNameMessage): void {
    const message = 'user.session.name'
    this.log.emit(message, data)
  }

  sendUserDeleteSession(data: UserRemoveSessionMessage): void {
    const message = 'user.session.delete'
    this.log.emit(message, data)
  }

  sendUserDeleteAllSessions(data: UserRemoveAllSessionsMessage): void {
    const message = 'user.all.sessions.delete'
    this.log.emit(message, data)
  }
}
