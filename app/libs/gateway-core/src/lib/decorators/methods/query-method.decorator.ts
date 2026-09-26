import { applyDecorators, QueryMethod } from '@nestjs/common';
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

interface IQUERYProtectedMethodOptions {
  path: string;
  okDesc?: string;
  operationDesc: string;
  badRequestDesc?: string;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IQUERYMethodOptions = Omit<
  IQUERYProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles'
>;

export const QUERYMethod = (options: IQUERYMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiOkResponse({
      description: options.okDesc || 'OK Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    QueryMethod(options.path),
  );
};

export const QUERYProtectedMethod = (
  options: IQUERYProtectedMethodOptions,
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
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    QueryMethod(options.path),
    Validate(...(options.roles || [])),
  );
};
