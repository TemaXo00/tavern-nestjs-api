import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { AuthResetPasswordGateway } from '@org/types';

export class ResetPasswordDto implements AuthResetPasswordGateway {
  @Email()
  email: string;

  @Password()
  newPassword: string;

  @Password()
  newPasswordConfirmation: string;
}
