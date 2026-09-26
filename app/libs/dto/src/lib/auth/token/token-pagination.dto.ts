import { type TokenPaginationInputGateway, TokenStates } from '@org/types';

import { TokenState } from '../../decorators/auth/token-state.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

export class TokenPaginationDto
  extends BasePaginationDto
  implements TokenPaginationInputGateway
{
  @TokenState({ required: false })
  state?: TokenStates;
}
