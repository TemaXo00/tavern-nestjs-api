import { Email } from "../../decorators/email.decorator.js";
import { Password } from "../../decorators/password.decorator.js";

import type { AuthRegisterGateway } from '@org/types'

export class RegisterDto implements AuthRegisterGateway {
  @Email()
  email: string;

  @Password()
  password: string;

  @Password()
  passwordConfirmation: string;
}
