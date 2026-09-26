import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from '@org/types';

import { AuthJWTGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Validate(...allowedRoles: Roles[]): MethodDecorator {
  return applyDecorators(
    SetMetadata('allowedRoles', allowedRoles),
    UseGuards(AuthJWTGuard, RolesGuard),
  );
}
