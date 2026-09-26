import { BlockUserGatewayInput } from '@org/types';

import { BlockReason } from '../../decorators/auth/block-reason.decorator.js';
import { BlockedUntil } from '../../decorators/auth/blocked-until.decorator.js';

export class BlockUserDto implements BlockUserGatewayInput {
  @BlockReason()
  blockReason: string;
  @BlockedUntil()
  blockedUntil: Date;
}
