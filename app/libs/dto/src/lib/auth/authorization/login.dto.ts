import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { LoginBaseInput } from '@org/types';

export class LoginDto implements LoginBaseInput {
  @Email()
  email: string;

  @Password()
  password: string;
}
