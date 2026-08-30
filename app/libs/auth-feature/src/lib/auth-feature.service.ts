import { Injectable } from "@nestjs/common";
import { SessionInput, type AuthOutput, type AuthServiceContract, type Empty, type ForgotPasswordInput, type LoginInput, type RefreshInput, type RegisterInput, type ResetPasswordInput, type UserEntity, type UserPayload, type ValidateInput } from "@org/types";

import { AuthAuthorizeUtil } from "./utils/auth.util";
import { AuthDatabaseUtil } from "./utils/database.util";
import { AuthJWTUtil } from "./utils/jwt.util";
import { AuthPasswordUtil } from "./utils/password.util";
import { AuthValidateUtil } from "./utils/validate.util";

@Injectable()
export class AuthFeatureService implements AuthServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validationUtil: AuthValidateUtil,
    private readonly passwordUtil: AuthPasswordUtil,
    private readonly authUtil: AuthAuthorizeUtil,
    private readonly jwtUtil: AuthJWTUtil
  ) {}

  async Register(data: RegisterInput): Promise<AuthOutput> {
    await this.validationUtil.validateRegisterEmailExists(data.email)
    this.passwordUtil.validatePasswordInput(data.password, data.passwordConfirmation)
    const hashedPassword = await this.passwordUtil.hashPassword(data.password)
    const newUser = await this.dbUtil.registerUser(data.email, hashedPassword)
    return await this.authUtil.authorizeNew(newUser, data.session)
  }

  async Login(data: LoginInput): Promise<AuthOutput> {
    const existingUser = await this.validationUtil.validateEmailFound(data.email)
    await this.validationUtil.validateUserBLock(existingUser.id)
    await this.passwordUtil.validatePassword(existingUser.passwordHash, data.password)
    return await this.authUtil.authorizeNew(existingUser, data.session)
  }

  async Refresh(data: RefreshInput): Promise<AuthOutput> {
    return await this.authUtil.authRefresh(data)
  }

  async Logout(data: RefreshInput): Promise<Empty> {
    const token = this.jwtUtil.verifyToken(data.refreshToken)
    const session = await this.validationUtil.validateSessionExists(token.id, token.sessionId)
    const validateSession: SessionInput = {
      ip: session.ip,
      device: session.device,
      os: session.os,
      browser: session.browser
    }
    this.validationUtil.validateSessionsSimilar(data.session, validateSession)
    await this.validationUtil.validateRefreshToken(session.refreshTokenHash, data.refreshToken)
    await this.dbUtil.removeSession(session.id)
    return {}
  }

  async Validate(data: ValidateInput): Promise<UserPayload> {
    const payload = this.validationUtil.validateAccessToken(data.accessToken)
    await this.validationUtil.validateUserExists(payload.id)
    const session = await this.validationUtil.validateSessionExists(payload.id, payload.sessionId)
    const validateSession: SessionInput = {
      ip: session.ip,
      device: session.device,
      os: session.os,
      browser: session.browser
    }
    this.validationUtil.validateSessionsSimilar(data.session, validateSession)
    return payload
  }

  async ForgotPassword(data: ForgotPasswordInput): Promise<Empty> {
    return {}
  }

  async ResetPassword(data: ResetPasswordInput): Promise<Empty> {
    return {}
  }

  async GetMe(data: ValidateInput): Promise<UserEntity> {
    const payload = this.validationUtil.validateAccessToken(data.accessToken)
    return await this.validationUtil.validateUserEntityExists(payload.id, payload.sessionId)
  }
}
