import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { TokenFeatureService } from "./token-feature.service";

import type {
  AllTokensOutput,
  DeleteAllNotActiveTokensInput,
  DeleteTokenInput,
  Empty,
  GetTokensInput,
  RevokeTokenInput,
  TokenByIdInput,
  TokenOutput,
  TokenServiceContract,
} from "@org/types";

@Controller()
export class TokenFeatureController implements TokenServiceContract {
  constructor(private readonly service: TokenFeatureService) {}

  @GrpcMethod('TokenService', 'GetTokensWithPagination')
  async GetTokensWithPagination(data: GetTokensInput): Promise<AllTokensOutput> {
    return await this.service.GetTokensWithPagination(data);
  }

  @GrpcMethod('TokenService', 'GetTokenById')
  async GetTokenById(data: TokenByIdInput): Promise<TokenOutput> {
    return await this.service.GetTokenById(data);
  }

  @GrpcMethod('TokenService', 'SetTokenRevoked')
  async SetTokenRevoked(data: RevokeTokenInput): Promise<TokenOutput> {
    return await this.service.SetTokenRevoked(data);
  }

  @GrpcMethod('TokenService', 'DeleteTokenById')
  async DeleteTokenById(data: DeleteTokenInput): Promise<TokenOutput> {
    return await this.service.DeleteTokenById(data);
  }

  @GrpcMethod('TokenService', 'DeleteAllNotActiveTokens')
  async DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Promise<Empty> {
    return await this.service.DeleteAllNotActiveTokens(data);
  }
}
