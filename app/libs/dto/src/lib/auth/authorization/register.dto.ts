import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { RegisterBaseInput } from '@org/types';

export class RegisterDto implements RegisterBaseInput {
  @Email()
  email: string;

  @Password()
  password: string;

  @Password()
  passwordConfirmation: string;
}
