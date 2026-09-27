import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { ResetPasswordGatewayInput } from '@org/types';

export class ResetPasswordDto implements ResetPasswordGatewayInput {
  @Email()
  email: string;

  @Password()
  newPassword: string;

  @Password()
  newPasswordConfirmation: string;
}
