import { TokenState } from '../../decorators/auth/token-state.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { TokenGatewayPaginationInput, TokenStates } from '@org/types';

export class TokenPaginationDto
  extends BasePaginationDto
  implements TokenGatewayPaginationInput
{
  @TokenState({ required: false })
  state?: TokenStates;
}
