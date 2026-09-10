import { Injectable } from "@nestjs/common";
import { AuthDatabaseService, Session, Token, TokenState, TokenWhereInput, User } from '@org/auth-database';
import { PaginationUtil, StringValidationUtil } from "@org/shared-utils";
import { AllTokensOutput, GRPC_TO_TOKEN_STATE, TOKEN_STATE_TO_GRPC, TokenPaginationInput } from "@org/types";

@Injectable()
export class AuthDatabaseUtil {
  constructor(
    private readonly db: AuthDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil
  ) { }

  // GET Methods

  async searchUserByEmail(email: string): Promise<User | null> {
    this.stringUtil.validateEmail(email)
    return await this.db.user.findUnique({
        where: {
          email
        },
      })
  }

  async searchUserById(id: string): Promise<User | null> {
    this.stringUtil.validateId(id)
    return await this.db.user.findUnique({
      where: {
        id
      }
    })
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    this.stringUtil.validateId(sessionId)
    return await this.db.session.findUnique({
      where: {
        id: sessionId,
      }
    })
  }

  async getUserWithSession(userId: string, sessionId: string): Promise<{ user: User, session: Session } | undefined> {
    this.stringUtil.validateId(userId)
    this.stringUtil.validateId(sessionId)
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
    this.stringUtil.validateEmail(email)
    return await this.db.token.findFirst({
      where: {
        email
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async searchTokenById(id: string): Promise<Token | null> {
    this.stringUtil.validateId(id)
    return await this.db.token.findUnique({
      where: {
        id
      }
    })
  }

  async getAllSessionsByUser(userId: string): Promise<Session[]> {
    this.stringUtil.validateId(userId)
    const sessions = await this.db.session.findMany({
      where: { userId },
    });

    return sessions.map((session) => ({
      ...session,
      localName: session.localName ?? `Session ${session.id}`,
    }));
  }

  async getPaginatedTokens(pagination?: TokenPaginationInput): Promise<AllTokensOutput> {
    const safePagination = pagination || {};
    const where = this.buildQueryForToken(safePagination);
    const total = await this.db.token.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)
    const tokens = await this.db.token.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      omit: { tokenHash: true}
    })
    const mappedTokens = tokens.map((token) => {return {...token, state: TOKEN_STATE_TO_GRPC[token.state]}})
    return {
      pagination: {
        ...params,
        search: safePagination.search,
        state: safePagination.state
      },
      tokens: mappedTokens
    }
  }

  // CREATE Methods

  async registerUser(email: string, passwordHash: string): Promise<User> {
    this.stringUtil.validateEmail(email)
    this.stringUtil.validateAnyString(passwordHash, 'Password')
    return await this.db.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });
  }

  async createSession(dto: { id: string, userId: string, device: string, browser: string, ip: string, os: string, refreshTokenHash: string }): Promise<void> {
    this.stringUtil.validateId(dto.userId);
    this.stringUtil.validateId(dto.id);
    this.stringUtil.validateAnyString(dto.device, 'Device')
    this.stringUtil.validateAnyString(dto.browser, 'Browser')
    this.stringUtil.validateAnyString(dto.ip, 'IP')
    this.stringUtil.validateAnyString(dto.os, 'OS')
    this.stringUtil.validateAnyString(dto.refreshTokenHash, 'Refresh Token Hash')
    await this.db.session.create({
      data: {
        ...dto
      }
    })
  }

  async createToken(dto: { email: string, tokenHash: string }): Promise<void> {
    this.stringUtil.validateEmail(dto.email)
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
    this.stringUtil.validateEmail(userEmail)
    this.stringUtil.validateAnyString(password, 'Password')
    await this.db.user.update({
      where: { email: userEmail },
      data: {
        passwordHash: password,
      },
    });
  }

  async setUserActive(id: string): Promise<void> {
    this.stringUtil.validateId(id)
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
    this.stringUtil.validateId(id)
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
    this.stringUtil.validateId(sessionId)
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
    this.stringUtil.validateAnyString(localName, 'Local name')
    return await this.db.session.update({
      where: {
        id: sessionId
      },
      data: {
        localName
      }
    })
  }

  async updateTokenState(id: string, state: TokenState): Promise<Token> {
    this.stringUtil.validateId(id)
    return await this.db.token.update({
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
    this.stringUtil.validateId(sessionId)
    return await this.db.session.delete({
      where: {
        id: sessionId
      }
    })
  }

  async removeAllSessions(userId: string): Promise<void> {
    this.stringUtil.validateId(userId)
    await this.db.session.deleteMany({
      where: {
        userId: userId
      }
    })
  }

  async removeToken(id: string): Promise<Token> {
    this.stringUtil.validateId(id)
    return await this.db.token.delete({
      where: {
        id
      }
    })
  }

  async removeInactiveTokens(): Promise<number> {
    const tokens = await this.db.token.deleteMany({
      where: {
        state: {not: 'ACTIVE'}
      }
    })
    return tokens.count
  }

  // QUERY BUILDERS

  buildQueryForToken(query: TokenPaginationInput): TokenWhereInput {
    const where: TokenWhereInput = {}

    if (query.search) {
      where.OR = [
        {
          email: {contains: query.search, mode: 'insensitive'}
        }
      ]
    }

    if (query.state) {
      where.state = GRPC_TO_TOKEN_STATE[query.state]
    }

    return where;
  }
}
