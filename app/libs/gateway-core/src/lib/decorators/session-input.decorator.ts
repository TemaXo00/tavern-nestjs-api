import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionInput } from '@org/types';

import { getSessionUtil } from '../utils/get-session.util';

export const SessionInputParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionInput => {
    return getSessionUtil(ctx);
  },
);
