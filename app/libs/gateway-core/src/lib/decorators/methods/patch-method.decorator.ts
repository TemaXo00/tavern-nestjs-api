import { applyDecorators, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@org/types';

import { Validate } from '../validate.decorator';

interface IPATCHProtectedMethodOptions {
  path: string;
  operationDesc: string;
  okDesc?: string;
  noContent?: boolean;
  badRequestDesc?: string;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IPATCHMethodOptions = Omit<
  IPATCHProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles' | 'noContent'
>;

export const PATCHMethod = (options: IPATCHMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'PATCH Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    Patch(options.path),
  );
};

export const PATCHProtectedMethod = (
  options: IPATCHProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: options.okDesc || 'PATCH Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    ApiUnauthorizedResponse({
      description: options.unauthorizedDesc || 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: options.forbiddenDesc || 'Forbidden',
    }),
    Patch(options.path),
    Validate(...(options.roles || [])),
  );
};
