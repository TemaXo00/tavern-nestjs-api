import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { AuthCoreDatabaseUtil } from './database.util';

import type { Session, User } from '@org/auth-database';
import type { SessionInput } from '@org/types';

@Injectable()
export class AuthCoreValidateUtil {
  constructor(private readonly dbUtil: AuthCoreDatabaseUtil) {}

  async validateUserWithSessionExists(
    id: string,
    sessionId: string,
  ): Promise<{ user: User; session: Session }> {
    const user = await this.dbUtil.getUserWithSession(id, sessionId);

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND,
      });
    }

    return user;
  }

  validateSessionsSimilar(
    currSession: SessionInput,
    newSession: SessionInput,
  ): void {
    if (
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

  async validateUserBlock(
    id: string,
    isBlocked: boolean,
    blockedUntil: Date | null,
    blockReason: string | null,
  ): Promise<void> {
    const date = new Date();

    if (isBlocked && blockedUntil && blockReason) {
      if (blockedUntil >= date) {
        await this.dbUtil.removeAllSessions(id);
        throw new RpcException({
          message: `User blocked until: ${blockedUntil.toDateString()}. Block reason: ${blockReason}`,
          code: status.UNAUTHENTICATED,
        });
      } else {
        await this.dbUtil.unblockUser(id);
      }
    }
  }

  async validateUserActive(userId: string, isActive: boolean): Promise<void> {
    if (!isActive) {
      await this.dbUtil.removeAllSessions(userId);
      throw new RpcException({
        message: 'User inactive',
        code: status.UNAUTHENTICATED,
      });
    }
  }
}
