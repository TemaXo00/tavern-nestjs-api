import { ChangePasswordGatewayInput } from '@org/types';

import { Password } from '../../decorators/auth/password.decorator.js';

export class ChangePasswordDto implements ChangePasswordGatewayInput {
  oldPassword: string;
  @Password()
  newPassword: string;
  @Password()
  newPasswordConfirmation: string;
}
