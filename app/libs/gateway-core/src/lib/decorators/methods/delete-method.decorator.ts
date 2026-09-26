import { applyDecorators, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@org/types';

import { Validate } from '../validate.decorator';

interface IDELETEProtectedMethodOptions {
  path: string;
  operationDesc: string;
  okDesc?: string;
  noContent?: boolean;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IDELETEMethodOptions = Omit<
  IDELETEProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles' | 'noContent'
>;

export const DELETEMethod = (
  options: IDELETEMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'DELETE Response',
    }),
    Delete(options.path),
  );
};

export const DELETEProtectedMethod = (
  options: IDELETEProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: options.okDesc || 'DELETE Response',
    }),
    ApiUnauthorizedResponse({
      description: options.unauthorizedDesc || 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: options.forbiddenDesc || 'Forbidden',
    }),
    Delete(options.path),
    Validate(...(options.roles || [])),
  );
};
