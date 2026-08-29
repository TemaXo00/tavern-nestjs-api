import { Injectable } from "@nestjs/common";

import { AuthDatabaseUtil } from "./utils/database.util";
import { AuthPasswordUtil } from "./utils/password.util";
import { AuthValidateUtil } from "./utils/validate.util";

import type { AuthOutput, AuthServiceContract, Empty, ForgotPasswordInput, LoginInput, RefreshInput, RegisterInput, ResetPasswordInput, UserEntity, UserPayload, ValidateInput } from "@org/types";

@Injectable()
export class AuthFeatureService implements AuthServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validationUtil: AuthValidateUtil,
    private readonly passwordUtil: AuthPasswordUtil
  ) {}

  async Register(data: RegisterInput): Promise<AuthOutput> {
    await this.validationUtil.validateRegisterEmailExists(data.email)
    this.validationUtil.validatePasswordInput(data.password, data.passwordConfirmation)
    const hashedPassword = await this.passwordUtil.hashPassword(data.password)
    const newUser = await this.dbUtil.registerUser(data.email, hashedPassword)
    return {
      accessToken: newUser.id,
      refreshToken: newUser.email
    }
  }

  Login(data: LoginInput): Promise<AuthOutput> {
    throw new Error("Method not implemented.",);
  }
  Refresh(data: RefreshInput): Promise<AuthOutput> {
    throw new Error("Method not implemented.");
  }
  Logout(data: RefreshInput): Promise<Empty> {
    throw new Error("Method not implemented.");
  }
  Validate(data: ValidateInput): Promise<UserPayload> {
    throw new Error("Method not implemented.");
  }
  ForgotPassword(data: ForgotPasswordInput): Promise<Empty> {
    throw new Error("Method not implemented.");
  }
  ResetPassword(data: ResetPasswordInput): Promise<Empty> {
    throw new Error("Method not implemented.");
  }
  GetMe(data: ValidateInput): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
}
