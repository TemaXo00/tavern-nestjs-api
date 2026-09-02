import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { UserPayload } from "@org/types";
import Redis from "ioredis";

@Injectable()
export class AuthCacheUtil {

  private accessTTL: number

  constructor(
    @InjectRedis() private readonly cache: Redis,
    private readonly config: ConfigService
  ) {
    const accessMinutes = this.config.get<number>('TAVERN_JWT_ACCESS_TOKEN_TTL', 15);

    this.accessTTL = accessMinutes * 60
  }

  async getPayload(userId: string, sessionId: string): Promise<UserPayload | null> {
    const payload = await this.cache.get(`session:${userId}:${sessionId}`)
    if (!payload) {
      return null
    }
    return JSON.parse(payload)
  }

  async setPayload(payload: UserPayload): Promise<void> {
    await this.cache.set(`session:${payload.id}:${payload.sessionId}`, JSON.stringify(payload), 'EX', this.accessTTL)
  }

  async delPayload(userId: string, sessionId: string): Promise<void> {
    await this.cache.del(`session:${userId}:${sessionId}`)
  }
}
