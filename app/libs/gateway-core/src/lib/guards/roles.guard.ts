import { status } from '@grpc/grpc-js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { ROLE_TO_GRPC, Roles } from '@org/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<Roles[]>('allowedRoles', context.getHandler());

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new RpcException({
        message: 'User not authenticated',
        code: status.UNAUTHENTICATED,
      });
    }

    const allowedGrpcRoles = allowedRoles.map((r) => ROLE_TO_GRPC[r]);

    if (!allowedGrpcRoles.includes(user.role)) {
      throw new RpcException({
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        code: status.PERMISSION_DENIED,
      });
    }

    return true;
  }
}
