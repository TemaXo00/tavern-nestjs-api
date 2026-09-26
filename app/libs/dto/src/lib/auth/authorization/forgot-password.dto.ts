import { Email } from '../../decorators/shared/email.decorator.js';

import type { AuthForgotPasswordGateway } from '@org/types';

export class ForgotPasswordDto implements AuthForgotPasswordGateway {
  @Email()
  email: string;
}
