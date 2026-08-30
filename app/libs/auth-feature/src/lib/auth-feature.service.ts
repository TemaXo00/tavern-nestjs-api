import { Injectable } from "@nestjs/common";
import { type AuthOutput, type AuthServiceContract, type Empty, type ForgotPasswordInput, type LoginInput, type RefreshInput, type RegisterInput, type ResetPasswordInput, type UserEntity, type UserPayload, type ValidateInput } from "@org/types";

import { AuthAuthorizeUtil } from "./utils/auth.util";
import { AuthDatabaseUtil } from "./utils/database.util";
import { AuthPasswordUtil } from "./utils/password.util";
import { AuthValidateUtil } from "./utils/validate.util";

@Injectable()
export class AuthFeatureService implements AuthServiceContract {

  constructor(
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validationUtil: AuthValidateUtil,
    private readonly passwordUtil: AuthPasswordUtil,
    private readonly authUtil: AuthAuthorizeUtil
  ) {}

  async Register(data: RegisterInput): Promise<AuthOutput> {
    await this.validationUtil.validateRegisterEmailExists(data.email)
    this.validationUtil.validatePasswordInput(data.password, data.passwordConfirmation)
    const hashedPassword = await this.passwordUtil.hashPassword(data.password)
    const newUser = await this.dbUtil.registerUser(data.email, hashedPassword)
    return await this.authUtil.authorizeNew(newUser, data.session)
  }

  async Login(data: LoginInput): Promise<AuthOutput> {
    const existingUser = await this.validationUtil.validateEmailFound(data.email)
    await this.validationUtil.validatePassword(existingUser.passwordHash, data.password)
    return await this.authUtil.authorizeNew(existingUser, data.session)
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
