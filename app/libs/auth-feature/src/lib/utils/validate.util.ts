import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices'
import { Session, User } from '@org/auth-database';
import { SessionInput, UserEntity, UserPayload } from '@org/types';
import * as argon2 from 'argon2'

import { AuthDatabaseUtil } from './database.util';
import { AuthJWTUtil } from './jwt.util';

@Injectable()
export class AuthValidateUtil {
  constructor(
    private readonly db: AuthDatabaseUtil,
    private readonly jwt: AuthJWTUtil
  ) { }

  // EMAIL Validation

  async validateRegisterEmailExists(email: string): Promise<void> {
    const isExists = await this.db.searchByEmail(email)

    if (isExists) {
      throw new RpcException({
        message: 'User with this email already exists',
        code: status.ALREADY_EXISTS
      })
    }
  }

  async validateEmailFound(email: string): Promise<User> {
    const isExists = await this.db.searchByEmail(email)

    if (!isExists) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return isExists
  }

  // TOKEN Validation

  async validateRefreshToken(tokenHash: string, token: string): Promise<void> {
    this.jwt.verifyToken(token)

    const isValid = await argon2.verify(tokenHash, token)

    if (!isValid) {
      throw new RpcException({
        message: 'Token invalid',
        code: status.UNAUTHENTICATED
      })
    }
  }

  validateAccessToken(token: string): UserPayload {
      const payload = this.jwt.verifyToken(token)
      return {
        id: payload.id,
        sessionId: payload.sessionId,
        role: payload.role
      }
  }

  // USER Validation

  async validateUserExists(id: string): Promise<User> {
    const user = await this.db.searchById(id)

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return user
  }

  async validateUserEntityExists(id: string, sessionId: string): Promise<UserEntity> {
    const user = await this.db.getUserEntity(id, sessionId)

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return user
  }

  async validateUserBLock(id: string): Promise<void> {
    const user = await this.validateUserExists(id)
    const date = new Date()

    if (user.isBlocked && user.blockedUntil && user.blockReason) {
      if (user.blockedUntil <= date) {
        throw new RpcException({
          message: `User blocked until: ${user.blockedUntil.toDateString()}. Block reason: ${user.blockReason}`,
          code: status.UNAUTHENTICATED
        })
      }
      else {
        await this.db.unblockUser(id)
      }
    }
  }

  // SESSION Validation

  async validateSessionExists(userId: string, sessionId: string): Promise<Session> {
    const session = await this.db.getSession(userId, sessionId)

    if (!session) {
      throw new RpcException({
        message: 'Session not found',
        code: status.UNAUTHENTICATED
      })
    }

    return session
  }

  validateSessionsSimilar(currSession: SessionInput, newSession: SessionInput): void {
    if (
      currSession.ip !== newSession.ip ||
      currSession.device !== newSession.device ||
      currSession.os !== newSession.os ||
      currSession.browser !== newSession.browser
    ) {
      throw new RpcException({
        message: 'Invalid session',
        code: status.UNAUTHENTICATED,
      });
    }
  }
}
