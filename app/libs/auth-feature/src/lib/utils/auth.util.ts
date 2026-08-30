import { Injectable } from "@nestjs/common";
import { User } from "@org/auth-database";
import { AuthOutput, ROLE_TO_GRPC, SessionInput } from "@org/types";
import { v7 as uuidv7 } from 'uuid'

import { AuthDatabaseUtil } from "./database.util";
import { AuthJWTUtil } from "./jwt.util";

@Injectable()
export class AuthAuthorizeUtil {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly jwtUtil: AuthJWTUtil
  ) {}

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
}
