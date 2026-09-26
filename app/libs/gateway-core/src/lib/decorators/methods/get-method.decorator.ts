import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@org/types';

import { Validate } from '../validate.decorator';

interface IGETProtectedMethodOptions {
  path: string;
  okDesc?: string;
  operationDesc: string;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IGETMethodOptions = Omit<
  IGETProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles'
>;

export const GETMethod = (options: IGETMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'OK Response',
    }),
    Get(options.path),
  );
};

export const GETProtectedMethod = (
  options: IGETProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: options.okDesc || 'OK Response',
    }),
    ApiUnauthorizedResponse({
      description: options.unauthorizedDesc || 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: options.forbiddenDesc || 'Forbidden',
    }),
    Get(options.path),
    Validate(...(options.roles || [])),
  );
};
