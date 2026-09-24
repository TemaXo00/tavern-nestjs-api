import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidateInput } from '@org/types';

import { getSessionUtil } from '../utils/get-session.util';

export const ValidateInputParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ValidateInput => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const accessToken = authHeader?.replace('Bearer ', '') || '';

    return {
      accessToken,
      session: getSessionUtil(ctx),
    };
  },
);
