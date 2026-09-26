import { Roles, type UserPaginationGatewayInput } from '@org/types';

import { IsActive } from '../../decorators/auth/is-active.decorator.js';
import { IsBlocked } from '../../decorators/auth/is-blocked.decorator.js';
import { Role } from '../../decorators/auth/role.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

export class UserPaginationDto
  extends BasePaginationDto
  implements UserPaginationGatewayInput
{
  @IsActive({ required: false })
  isActive?: boolean;

  @IsBlocked({ required: false })
  isBlocked?: boolean;

  @Role({ required: false })
  role?: Roles;
}
