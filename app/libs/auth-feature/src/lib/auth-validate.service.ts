import { Injectable } from '@nestjs/common'
import { AuthAuthorizeUtil, AuthCacheUtil, AuthJWTUtil } from '@org/auth-utils';
import { UserPayload, ValidateInput } from '@org/types';

@Injectable()
export class AuthValidateService {
  constructor(
    private readonly jwtUtil: AuthJWTUtil,
    private readonly cacheUtil: AuthCacheUtil,
    private readonly authUtil: AuthAuthorizeUtil
  ) { }

  async Validate(data: ValidateInput): Promise<UserPayload> {
    const payload = this.jwtUtil.validateAccessToken(data.accessToken)
    const redisPayload = await this.cacheUtil.getPayload(payload.id, payload.sessionId)
    if (redisPayload) {
      return redisPayload
    }
    await this.authUtil.validateSession(payload.id, payload.sessionId, data.accessToken, 'access', data.session, true)
    await this.cacheUtil.setPayload(payload)
    return payload
  }
}
