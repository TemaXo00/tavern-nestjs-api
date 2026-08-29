import { Injectable } from "@nestjs/common";
import { AuthDatabaseService, User } from '@org/auth-database';
import { ROLE_TO_GRPC, UserEntity } from "@org/types";

@Injectable()
export class AuthDatabaseUtil {
  constructor(private readonly db: AuthDatabaseService) { }

  async registerUser(email: string, passwordHash: string): Promise<User> {
    return await this.db.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: {
        passwordHash: password,
      },
    });
  }

  async getUserEntity(userId: string, sessionId: string): Promise<UserEntity | undefined> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          where: { id: sessionId },
          take: 1,
          select: {
            id: true,
            localName: true
          }
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
}
