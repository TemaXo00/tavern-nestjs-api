import { applyDecorators, Put } from '@nestjs/common';
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

interface IPUTProtectedMethodOptions {
  path: string;
  operationDesc: string;
  okDesc?: string;
  badRequestDesc?: string;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IPUTMethodOptions = Omit<
  IPUTProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles'
>;

export const PUTMethod = (options: IPUTMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'PUT Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    Put(options.path),
  );
};

export const PUTProtectedMethod = (
  options: IPUTProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: options.okDesc || 'PUT Response',
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
    Put(options.path),
    Validate(...(options.roles || [])),
  );
};
