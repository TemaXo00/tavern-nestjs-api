import { Email } from "../../decorators/email.decorator.js";
import { Password } from "../../decorators/password.decorator.js";

import type { AuthLoginGateway } from "@org/types";

export class LoginDto implements AuthLoginGateway {
  @Email()
  email: string;

  @Password()
  password: string;

}
