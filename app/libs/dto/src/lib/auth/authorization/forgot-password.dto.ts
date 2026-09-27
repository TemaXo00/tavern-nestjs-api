import { Email } from '../../decorators/shared/email.decorator.js';

import type { ForgotPasswordInput } from '@org/types';

export class ForgotPasswordDto implements ForgotPasswordInput {
  @Email()
  email: string;
}
