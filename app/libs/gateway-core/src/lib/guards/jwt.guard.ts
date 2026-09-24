import { ExecutionContext, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidateInput, AuthServiceContract } from '@org/types';

import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') implements OnModuleInit {
  private authService!: AuthServiceContract;

  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientGrpc) {
    super();
  }

  onModuleInit(): void {
    this.authService = this.client.getService('AuthService');
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing access token');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const accessToken = authHeader.replace('Bearer ', '');

    const validation: ValidateInput = {
      accessToken,
      session: {
        ip: request.ip,
        device: request.headers['x-device'] || 'Unknown',
        browser: request.headers['user-agent'] || 'Unknown',
        os: request.headers['x-os'] || 'Unknown',
      },
    };

    const payload = await this.authService.Validate(validation);
    request.user = payload;

    return true;
  }
}
