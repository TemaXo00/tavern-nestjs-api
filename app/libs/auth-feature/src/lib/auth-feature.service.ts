import { Injectable } from "@nestjs/common";
import { AuthAuthorizeUtil, AuthDatabaseUtil, AuthJWTUtil, AuthMessagesUtil, AuthPasswordUtil, AuthTokenUtil, AuthValidateUtil } from "@org/auth-utils";
import { ROLE_TO_GRPC, type AuthOutput, type AuthServiceContract, type Empty, type ForgotPasswordInput, type LoginInput, type RefreshInput, type RegisterInput, type ResetPasswordInput, type UserEntity, type UserPayload, type ValidateInput } from "@org/types";

@Injectable()
export class AuthFeatureService implements AuthServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validationUtil: AuthValidateUtil,
    private readonly passwordUtil: AuthPasswordUtil,
    private readonly authUtil: AuthAuthorizeUtil,
    private readonly jwtUtil: AuthJWTUtil,
    private readonly messagesUtil: AuthMessagesUtil,
    private readonly tokenUtil: AuthTokenUtil
  ) {}

  async Register(data: RegisterInput): Promise<AuthOutput> {
    await this.validationUtil.validateRegisterEmailExists(data.email)
    this.passwordUtil.validatePasswordInput(data.password, data.passwordConfirmation)
    const hashedPassword = await this.passwordUtil.hashPassword(data.password)
    const newUser = await this.dbUtil.registerUser(data.email, hashedPassword)
    const { accessToken, refreshToken } = await this.authUtil.authorizeNew(newUser, data.session)
    this.messagesUtil.sendUserRegisterMessage({ id: newUser.id, email: data.email, createdAt: newUser.createdAt })
    return {
      accessToken,
      refreshToken
    }
  }

  async Login(data: LoginInput): Promise<AuthOutput> {
    const existingUser = await this.validationUtil.validateEmailFound(data.email)
    await this.validationUtil.validateUserBlock(existingUser.id, existingUser.isBlocked, existingUser.blockedUntil, existingUser.blockReason)
    await this.validationUtil.validateUserActive(existingUser.id, existingUser.isActive)
    await this.passwordUtil.validatePassword(existingUser.passwordHash, data.password)
    const { accessToken, refreshToken } = await this.authUtil.authorizeNew(existingUser, data.session)
    this.messagesUtil.sendUserLoginMessage({ id: existingUser.id, email: existingUser.email, session: data.session })
    return {
      accessToken,
      refreshToken
    }  }

  async Refresh(data: RefreshInput): Promise<AuthOutput> {
    return await this.authUtil.authRefresh(data)
  }

  async Logout(data: RefreshInput): Promise<Empty> {
    const token = this.jwtUtil.verifyToken(data.refreshToken)
    await this.authUtil.validateSession(token.id, token.sessionId, data.refreshToken, 'refresh', data.session)
    await this.dbUtil.removeSession(token.sessionId)
    return {}
  }

  async Validate(data: ValidateInput): Promise<UserPayload> {
    const payload = this.jwtUtil.validateAccessToken(data.accessToken)
    await this.authUtil.validateSession(payload.id, payload.sessionId, data.accessToken, 'access', data.session, true)
    return payload
  }

  async ForgotPassword(data: ForgotPasswordInput): Promise<Empty> {
    const user = await this.dbUtil.searchUserByEmail(data.email)
    if (!user) {
      return {}
    }
    if (await this.validationUtil.validateTokenExisting(data.email)) {
      return {}
    }
    const { token, hashToken } = await this.tokenUtil.generateTokens()
    await this.dbUtil.createToken({ email: data.email, tokenHash: hashToken })
    this.messagesUtil.sendUserForgotPasswordMessage(data.email, token, hashToken)
    return {}
  }

  async ResetPassword(data: ResetPasswordInput): Promise<Empty> {
    const token = await this.validationUtil.validateTokenFound(data.email)
    this.passwordUtil.validatePasswordInput(data.newPassword, data.newPasswordConfirmation)
    await this.tokenUtil.validateTokenHash(data.token, token.tokenHash)
    await this.dbUtil.updateUserPassword(data.email, data.newPassword)
    await this.dbUtil.updateTokenState(token.id, 'USED')
    this.messagesUtil.sendUserRestorePassword({email: data.email, session: data.session})
    return {}
  }

  async GetMe(data: ValidateInput): Promise<UserEntity> {
    const payload = await this.Validate(data)
    const { user, session } = await this.validationUtil.validateUserWithSessionExists(payload.id, payload.sessionId)
    return {
      id: user.id,
      email: user.email,
      role: ROLE_TO_GRPC[user.role],
      isActive: user.isActive,
      sessionId: session.id,
      sessionName: session.localName ?? `Session ${session.id}`
    }
  }
}
