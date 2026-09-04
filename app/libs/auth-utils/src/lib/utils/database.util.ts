import { Injectable } from "@nestjs/common";
import { AuthDatabaseService, Session, Token, TokenState, User } from '@org/auth-database';

@Injectable()
export class AuthDatabaseUtil {
  constructor(private readonly db: AuthDatabaseService) { }

  // GET Methods

  async searchUserByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
        where: {
          email
        },
      })
  }

  async searchUserById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: {
        id
      }
    })
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    return await this.db.session.findUnique({
      where: {
        id: sessionId,
      }
    })
  }

  async getUserWithSession(userId: string, sessionId: string): Promise<{user: User, session: Session} | undefined> {
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
      session: user.sessions[0]
    }
  }

  async searchTokenByEmail(email: string): Promise<Token | null> {
    return await this.db.token.findFirst({
      where: {
        email
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async getAllSessionsByUser(userId: string): Promise<Session[]> {
    const sessions = await this.db.session.findMany({
      where: { userId },
    });

    return sessions.map((session) => ({
      ...session,
      localName: session.localName ?? `Session ${session.id}`,
    }));
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

  async createSession(dto: { id: string, userId: string, device: string, browser: string, ip: string, os: string, refreshTokenHash: string }): Promise<void> {
    await this.db.session.create({
      data: {
        ...dto
      }
    })
  }

  async createToken(dto: { email: string, tokenHash: string }): Promise<void> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1)

    await this.db.token.create({
      data: {
        ...dto,
        expiresAt: expiresAt
      }
    })
  }

  // UPDATE Methods

  async updateUserPassword(userEmail: string, password: string): Promise<void> {
    await this.db.user.update({
      where: { email: userEmail },
      data: {
        passwordHash: password,
      },
    });
  }

  async setUserActive(id: string): Promise<void> {
    await this.db.user.update({
      where: {
        id
      },
      data: {
        isActive: true
      }
    })
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

  async updateSessionLocalname(sessionId: string, localName: string): Promise<Session> {
    return await this.db.session.update({
      where: {
        id: sessionId
      },
      data: {
        localName
      }
    })
  }

  async updateTokenState(id: string, state: TokenState): Promise<void> {
    await this.db.token.update({
      where: {
        id
      },
      data: {
        state
      }
    })
  }

  // DELETE Methods

  async removeSession(sessionId: string): Promise<Session> {
    return await this.db.session.delete({
      where: {
        id: sessionId
      }
    })
  }

  async removeAllSessions(userId: string): Promise<void> {
    await this.db.session.deleteMany({
      where: {
        userId: userId
      }
    })
  }
}
