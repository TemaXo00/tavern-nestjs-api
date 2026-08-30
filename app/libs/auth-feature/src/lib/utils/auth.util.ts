import { Injectable } from "@nestjs/common";
import { User } from "@org/auth-database";
import { AuthOutput, RefreshInput, ROLE_TO_GRPC, SessionInput } from "@org/types";
import { v7 as uuidv7 } from 'uuid'

import { AuthDatabaseUtil } from "./database.util";
import { AuthJWTUtil } from "./jwt.util";
import { AuthValidateUtil } from "./validate.util";

@Injectable()
export class AuthAuthorizeUtil {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly jwtUtil: AuthJWTUtil,
    private readonly validationUtil: AuthValidateUtil
  ) { }

  async authorizeNew(user: User, session: SessionInput): Promise<AuthOutput> {
    const sessionId = uuidv7();
    const { accessToken, refreshToken } = this.jwtUtil.generateTokens({
      id: user.id,
      sessionId: sessionId,
      role: ROLE_TO_GRPC[user.role]
    })
    const refreshTokenHash = await this.jwtUtil.hashToken(refreshToken)
    await this.dbUtil.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.jwtUtil.getExpireDate(),
      ...session
    })
    return { accessToken, refreshToken}
  }

  async authRefresh(data: RefreshInput): Promise<AuthOutput> {
    const token = this.jwtUtil.verifyToken(data.refreshToken)
    const user = await this.validateSession(token.id, token.sessionId, data.refreshToken, data.session, true)
    const { accessToken, refreshToken } = this.jwtUtil.generateTokens({
      id: token.id,
      sessionId: token.sessionId,
      role: ROLE_TO_GRPC[user.role]
    })
    const refreshTokenHash = await this.jwtUtil.hashToken(refreshToken)
    await this.dbUtil.updateSessionToken(token.sessionId, refreshTokenHash)
    return { accessToken, refreshToken}
  }

  async validateSession(userId: string, sessionId: string, token: string, userSession: SessionInput, checkActive?: boolean): Promise<User> {
    const {user, session} = await this.validationUtil.validateUserWithSessionExists(userId, sessionId)
    const validateSession: SessionInput = {
      ip: session.ip,
      device: session.device,
      os: session.os,
      browser: session.browser
    }
    await this.jwtUtil.validateRefreshToken(session.refreshTokenHash, token)
    this.validationUtil.validateSessionsSimilar(userSession, validateSession)
    await this.validationUtil.validateUserBlock(user.id, user.isBlocked, user.blockedUntil, user.blockReason)
    if (checkActive) {
      await this.validationUtil.validateUserActive(user.id, user.isActive)
    }
    return user
  }
}
