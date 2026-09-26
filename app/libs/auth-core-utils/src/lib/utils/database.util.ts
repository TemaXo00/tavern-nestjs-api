import { Injectable } from '@nestjs/common';
import {
  AuthDatabaseService,
  type Session,
  type User,
} from '@org/auth-database';
import { StringValidationUtil } from '@org/shared-utils';

@Injectable()
export class AuthCoreDatabaseUtil {
  constructor(
    private readonly stringUtil: StringValidationUtil,
    private readonly db: AuthDatabaseService,
  ) {}

  async getUserWithSession(
    userId: string,
    sessionId: string,
  ): Promise<{ user: User; session: Session } | undefined> {
    this.stringUtil.validateId(userId);
    this.stringUtil.validateId(sessionId);
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          where: { id: sessionId },
          take: 1,
        },
      },
    });

    if (!user || user.sessions.length === 0) {
      return undefined;
    }

    return {
      user: user,
      session: user.sessions[0],
    };
  }

  async createSession(dto: {
    id: string;
    userId: string;
    device: string;
    browser: string;
    ip: string;
    os: string;
    refreshTokenHash: string;
  }): Promise<void> {
    this.stringUtil.validateId(dto.userId);
    this.stringUtil.validateId(dto.id);
    this.stringUtil.validateAnyString(dto.device, 'Device');
    this.stringUtil.validateAnyString(dto.browser, 'Browser');
    this.stringUtil.validateAnyString(dto.ip, 'IP');
    this.stringUtil.validateAnyString(dto.os, 'OS');
    this.stringUtil.validateAnyString(
      dto.refreshTokenHash,
      'Refresh Token Hash',
    );
    await this.db.session.create({
      data: {
        ...dto,
      },
    });
  }

  async updateSessionToken(
    sessionId: string,
    refreshTokenHash: string,
  ): Promise<void> {
    this.stringUtil.validateId(sessionId);
    await this.db.session.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  async removeAllSessions(userId: string): Promise<void> {
    this.stringUtil.validateId(userId);
    await this.db.session.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async unblockUser(id: string): Promise<User> {
    this.stringUtil.validateId(id);
    return await this.db.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: false,
        blockReason: null,
        blockedUntil: null,
      },
    });
  }
}
