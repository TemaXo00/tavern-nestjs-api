import { applyDecorators, Get, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@org/types';

import { Validate } from '../validate.decorator';

interface IGETMethodOptions {
  path: string;
  okDesc?: string;
  operationDesc: string;
  okType?: Type<unknown>;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

export const GETMethod = (options: IGETMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'OK Response',
      type: options.okType,
    }),
    Get(options.path),
  );
};

export const GETProtectedMethod = (
  options: IGETMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: options.okDesc || 'OK Response',
      type: options.okType,
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
