import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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
    return this.jwt.verify(token);
  }

  async hashToken(token: string): Promise<string> {
    return await argon2.hash(token, {
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id
    })
  }
}
