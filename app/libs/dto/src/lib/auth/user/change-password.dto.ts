import { ChangePasswordBaseInput } from '@org/types';

import { Password } from '../../decorators/auth/password.decorator.js';

export class ChangePasswordDto implements ChangePasswordBaseInput {
  @Password()
  oldPassword: string;
  @Password()
  newPassword: string;
  @Password()
  newPasswordConfirmation: string;
}
