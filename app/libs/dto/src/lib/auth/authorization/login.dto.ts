import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { AuthLoginGateway } from '@org/types';

export class LoginDto implements AuthLoginGateway {
  @Email()
  email: string;

  @Password()
  password: string;
}
