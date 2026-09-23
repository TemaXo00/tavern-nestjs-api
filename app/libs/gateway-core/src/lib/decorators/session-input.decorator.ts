import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionInput } from '@org/types';

export const SessionInputParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionInput => {
    const request = ctx.switchToHttp().getRequest();

    return {
      ip: request.ip,
      device: request.headers['x-device'] || 'Unknown',
      browser: request.headers['user-agent'] || 'Unknown',
      os: request.headers['x-os'] || 'Unknown',
    }
  },
);
