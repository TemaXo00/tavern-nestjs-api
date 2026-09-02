import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices';
import { AuthAuthorizeUtil, AuthCacheUtil, AuthJWTUtil } from '@org/auth-utils';
import { ROLE_TO_GRPC, Roles, UserPayload, ValidateInput } from '@org/types';

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

  async validateWithRoles(
    data: ValidateInput,
    allowedRoles: Roles[],
  ): Promise<UserPayload> {
    const payload = await this.Validate(data);

    const allowedGrpcRoles = allowedRoles.map((r) => ROLE_TO_GRPC[r]);

    if (!allowedGrpcRoles.includes(payload.role)) {
      const roleNames = allowedRoles.join(', ');
      throw new RpcException({
        message: `Access denied. Required roles: ${roleNames}`,
        code: status.PERMISSION_DENIED,
      });
    }

    return payload;
  }
}
