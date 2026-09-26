import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { AuthRegisterGateway } from '@org/types';

export class RegisterDto implements AuthRegisterGateway {
  @Email()
  email: string;

  @Password()
  password: string;

  @Password()
  passwordConfirmation: string;
}
