import { status } from "@grpc/grpc-js";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { AuthOutput, UserPayload } from "@org/types";
import * as argon2 from 'argon2'

@Injectable()
export class AuthJWTUtil {
  private readonly accessTTL: number;
  private readonly refreshTTL: number;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {
    const accessMinutes = this.config.get<number>('TAVERN_JWT_ACCESS_TOKEN_TTL', 15);
    const refreshDays = this.config.get<number>('TAVERN_JWT_REFRESH_TOKEN_TTL', 30);

    this.accessTTL = accessMinutes * 60;
    this.refreshTTL = refreshDays * 24 * 60 * 60;
  }

  generateTokens(payload: UserPayload): AuthOutput {
    const accessToken = this.jwt.sign(payload, { expiresIn: this.accessTTL });
    const refreshToken = this.jwt.sign(payload, { expiresIn: this.refreshTTL });

    return { accessToken, refreshToken };
  }

  getExpireDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + this.refreshTTL)
    return date.toISOString()
  }

  verifyToken(token: string): UserPayload & { iat: number; exp: number } {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      let message = 'Invalid or expired token';
      if (error instanceof TokenExpiredError) {
        message = 'Token has expired';
      } else if (error instanceof JsonWebTokenError) {
        message = 'Invalid token';
      }
      throw new RpcException({
        message,
        code: status.UNAUTHENTICATED,
      });
    }
  }

  async hashToken(token: string): Promise<string> {
    return await argon2.hash(token, {
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id
    })
  }

  async validateRefreshToken(tokenHash: string, token: string): Promise<void> {
    this.verifyToken(token)

    const isValid = await argon2.verify(tokenHash, token)

    if (!isValid) {
      throw new RpcException({
        message: 'Token invalid',
        code: status.UNAUTHENTICATED
      })
    }
  }

  validateAccessToken(token: string): UserPayload {
      const payload = this.verifyToken(token)
      return {
        id: payload.id,
        sessionId: payload.sessionId,
        role: payload.role
      }
  }
}
