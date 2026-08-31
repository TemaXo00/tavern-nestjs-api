import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthRegisteredMessage, SessionInput } from "@org/types";

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

  sendUserLoginMessage(data: { id: string, email: string, session: SessionInput }): void {
    const message = 'user.login'
    this.mail.emit(message, data)
    this.log.emit(message, data)
  }

  sendUserForgotPasswordMessage(email: string, token: string, tokenHash: string): void {
    const message = 'user.forgot.password'
    this.mail.emit(message, {email: email, token: token})
    this.log.emit(message, {email: email, tokenHash: tokenHash})
  }

  sendUserRestorePassword(data: { email: string, session: SessionInput }): void {
    const message = 'user.restore.password'
    this.mail.emit(message, data)
    this.log.emit(message, data)
  }

  sendUserLogoutMessage(data: { userId: string, sessionId: string }): void {
    const message = 'user.logout'
    this.log.emit(message, data)
  }
}
