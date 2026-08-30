import { Injectable } from "@nestjs/common";
import { AuthDatabaseService, Session, User } from '@org/auth-database';
import { ROLE_TO_GRPC, UserEntity } from "@org/types";

@Injectable()
export class AuthDatabaseUtil {
  constructor(private readonly db: AuthDatabaseService) { }

  // GET Methods

  async searchByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
        where: {
          email
        },
      })
  }

  async searchById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: {
        id
      }
    })
  }

  async getUserEntity(userId: string, sessionId: string): Promise<UserEntity | undefined> {
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

    const session = user.sessions[0];

    return {
      id: user.id,
      email: user.email,
      role: ROLE_TO_GRPC[user.role],
      isActive: user.isActive,
      sessionId: session.id,
      sessionName: session.localName ?? `Session ${session.id}`,
    };
  }

  async getSession(userId: string, sessionId: string): Promise<Session | null> {
    return await this.db.session.findUnique({
      where: {
        id: sessionId,
        userId: userId
      }
    })
  }
  // CREATE Methods

  async registerUser(email: string, passwordHash: string): Promise<User> {
    return await this.db.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });
  }

  async createSession(dto: { id: string, userId: string, device: string, browser: string, ip: string, os: string, refreshTokenHash: string, expiresAt: string }): Promise<void> {
    await this.db.session.create({
      data: {
        ...dto
      }
    })
  }

  // UPDATE Methods

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: {
        passwordHash: password,
      },
    });
  }

  async unblockUser(id: string): Promise<void> {
    await this.db.user.update({
      where: {
        id
      },
      data: {
        isBlocked: false,
        blockReason: null,
        blockedUntil: null
      }
    })
  }

  async updateSessionToken(sessionId: string, refreshTokenHash: string): Promise<void> {
    await this.db.session.update({
      where: {
        id: sessionId
      },
      data: {
        refreshTokenHash
      }
    })
  }

  // DELETE Methods

  async removeSession(sessionId: string): Promise<void> {
    await this.db.session.delete({
      where: {
        id: sessionId
      }
    })
  }
}
