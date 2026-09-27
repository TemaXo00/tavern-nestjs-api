import { ChangeEmailBaseInput } from '@org/types';

import { Email } from '../../decorators/shared/email.decorator.js';

export class ChangeEmailDto implements ChangeEmailBaseInput {
  @Email()
  newEmail: string;
}
