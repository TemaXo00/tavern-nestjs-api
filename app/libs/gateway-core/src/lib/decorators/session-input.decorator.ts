import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionInput } from '@org/types';
import { UAParser } from 'ua-parser-js';

export const SessionInputParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionInput => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);

    return {
      ip: request.ip,
      device: parser.getDevice().model || parser.getDevice().type || 'Desktop',
      browser: parser.getBrowser().name || 'Unknown',
      os: parser.getOS().name || 'Unknown',
    };
  },
);
