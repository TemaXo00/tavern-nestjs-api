import { Email } from "../../decorators/email.decorator.js";
import { Password } from "../../decorators/password.decorator.js";

import type { AuthResetPasswordGateway } from "@org/types";

export class ResetPasswordDto implements AuthResetPasswordGateway {
  @Email()
  email: string;

  @Password()
  newPassword: string;

  @Password()
  newPasswordConfirmation: string;

}
