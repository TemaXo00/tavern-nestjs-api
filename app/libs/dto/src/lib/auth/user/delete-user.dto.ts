import { BaseUserDeleteInput } from '@org/types';

import { Password } from '../../decorators/auth/password.decorator.js';

export class DeleteUserDto implements BaseUserDeleteInput {
  @Password()
  password: string;
}
