import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidateInput } from '@org/types';

export const ValidateInputParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ValidateInput => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const accessToken = authHeader?.replace('Bearer ', '') || '';

    return {
      accessToken,
      session: {
        ip: request.ip,
        device: request.headers['x-device'] || 'Unknown',
        browser: request.headers['user-agent'] || 'Unknown',
        os: request.headers['x-os'] || 'Unknown',
      },
    };
  },
);
