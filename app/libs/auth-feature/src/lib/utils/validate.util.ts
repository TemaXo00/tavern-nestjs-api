import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices'
import { Session, User } from '@org/auth-database';
import { SessionInput } from '@org/types';

import { AuthDatabaseUtil } from './database.util';

@Injectable()
export class AuthValidateUtil {
  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
  ) { }

  // EMAIL Validation

  async validateRegisterEmailExists(email: string): Promise<void> {
    const isExists = await this.dbUtil.searchUserByEmail(email)

    if (isExists) {
      throw new RpcException({
        message: 'User with this email already exists',
        code: status.ALREADY_EXISTS
      })
    }
  }

  async validateEmailFound(email: string): Promise<User> {
    const isExists = await this.dbUtil.searchUserByEmail(email)

    if (!isExists) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return isExists
  }

  // USER Validation

  async validateUserExists(id: string): Promise<User> {
    const user = await this.dbUtil.searchUserById(id)

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return user
  }

  async validateUserWithSessionExists(id: string, sessionId: string): Promise<{ user: User, session: Session }> {
    const user = await this.dbUtil.getUserWithSession(id, sessionId)

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return user
  }

  async validateUserBlock(id: string, isBlocked: boolean, blockedUntil: Date | null, blockReason: string | null): Promise<void> {
    const date = new Date()

    if (isBlocked && blockedUntil && blockReason) {
      if (blockedUntil <= date) {
        await this.dbUtil.removeAllSessions(id)
        throw new RpcException({
          message: `User blocked until: ${blockedUntil.toDateString()}. Block reason: ${blockReason}`,
          code: status.UNAUTHENTICATED
        })
      }
      else {
        await this.dbUtil.unblockUser(id)
      }
    }
  }

  async validateUserActive(userId: string, isActive: boolean): Promise<void> {
    if (!isActive) {
      await this.dbUtil.removeAllSessions(userId)
      throw new RpcException({
        message: 'User inactive',
        code: status.UNAUTHENTICATED
      })
    }
  }

  // SESSION Validation

  async validateSessionExists(sessionId: string): Promise<Session> {
    const session = await this.dbUtil.getSessionById(sessionId)

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
