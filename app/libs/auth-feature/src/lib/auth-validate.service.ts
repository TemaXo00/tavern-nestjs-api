import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices';
import { AuthAuthorizeUtil, AuthCacheUtil, AuthJWTUtil } from '@org/auth-utils';
import { StringValidationUtil } from '@org/shared-utils';
import { ROLE_TO_GRPC, Roles, UserPayload, ValidateInput } from '@org/types';

@Injectable()
export class AuthValidateService {
  constructor(
    private readonly jwtUtil: AuthJWTUtil,
    private readonly cacheUtil: AuthCacheUtil,
    private readonly authUtil: AuthAuthorizeUtil,
    private readonly stringUtil: StringValidationUtil
  ) { }

  async Validate(data: ValidateInput): Promise<UserPayload> {
    this.validateInputFields(data)
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

  private validateInputFields(validation: ValidateInput): void {
    this.stringUtil.validateAnyString(validation.accessToken, 'Access Token')
    this.stringUtil.validateAnyString(validation.session.browser, 'Browser')
    this.stringUtil.validateAnyString(validation.session.ip, 'IP')
    this.stringUtil.validateAnyString(validation.session.device, 'Device')
    this.stringUtil.validateAnyString(validation.session.os, 'OS')
  }
}
