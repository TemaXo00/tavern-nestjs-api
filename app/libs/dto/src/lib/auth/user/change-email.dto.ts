import { ChangeEmailGatewayInput } from '@org/types';

import { Email } from '../../decorators/shared/email.decorator.js';

export class ChangeEmailDto implements ChangeEmailGatewayInput {
  @Email()
  newEmail: string;
}
