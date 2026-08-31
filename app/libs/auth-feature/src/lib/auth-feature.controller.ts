import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { AuthFeatureService } from "./auth-feature.service";

import type { AuthOutput, AuthServiceContract, Empty, ForgotPasswordInput, LoginInput, RefreshInput, RegisterInput, ResetPasswordInput, UserEntity, UserPayload, ValidateInput } from "@org/types";

@Controller()
export class AuthFeatureController implements AuthServiceContract {

  constructor(private readonly service: AuthFeatureService) {}

  @GrpcMethod('AuthService', 'Register')
  async Register(data: RegisterInput): Promise<AuthOutput> {
    return await this.service.Register(data)
  }

  @GrpcMethod('AuthService', 'Login')
  async Login(data: LoginInput): Promise<AuthOutput> {
    return await this.service.Login(data)
  }

  @GrpcMethod('AuthService', 'Refresh')
  async Refresh(data: RefreshInput): Promise<AuthOutput> {
    return await this.service.Refresh(data)
  }

  @GrpcMethod('AuthService', 'Logout')
  async Logout(data: RefreshInput): Promise<Empty> {
    return await this.service.Logout(data)
  }

  @GrpcMethod('AuthService', 'Validate')
  async Validate(data: ValidateInput): Promise<UserPayload> {
    return await this.service.Validate(data)
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  async ForgotPassword(data: ForgotPasswordInput): Promise<Empty> {
    return await this.service.ForgotPassword(data)
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  async ResetPassword(data: ResetPasswordInput): Promise<Empty> {
    return await this.service.ResetPassword(data)
  }

  @GrpcMethod('AuthService', 'GetMe')
  async GetMe(data: ValidateInput): Promise<UserEntity> {
    return await this.service.GetMe(data)
  }
}
