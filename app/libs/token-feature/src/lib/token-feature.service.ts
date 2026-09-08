import { Injectable } from "@nestjs/common";
import { Token } from "@org/auth-database";
import { AuthValidateService } from "@org/auth-feature";
import { AuthDatabaseUtil, AuthValidateUtil } from "@org/auth-utils";
import { AllTokensOutput, DeleteAllNotActiveTokensInput, DeleteTokenInput, Empty, GetTokensInput, RevokeTokenInput, Roles, TOKEN_STATE_TO_GRPC, TokenByIdInput, TokenOutput, TokenServiceContract, TokenStates } from '@org/types'

@Injectable()
export class TokenFeatureService implements TokenServiceContract {
  constructor(
    private readonly validation: AuthValidateService,
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil
  ) {}

  async GetTokensWithPagination(data: GetTokensInput): Promise<AllTokensOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    return await this.dbUtil.getPaginatedTokens(data.pagination)
  }

  async GetTokenById(data: TokenByIdInput): Promise<TokenOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const token = await this.validateUtil.validateTokenFound(data.id, 'id')
    return this.mapToken(token)
  }

  async SetTokenRevoked(data: RevokeTokenInput): Promise<TokenOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateTokenFound(data.id, 'id')
    const token = await this.dbUtil.updateTokenState(data.id, TokenStates.REVOKED)
    return this.mapToken(token)
  }

  async DeleteTokenById(data: DeleteTokenInput): Promise<TokenOutput> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateTokenFound(data.id, 'id')
    const token = await this.dbUtil.removeToken(data.id)
    return this.mapToken(token)
  }

  async DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Promise<Empty> {
    await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.dbUtil.removeInactiveTokens()
    return {}
  }

  private mapToken(token: Token): TokenOutput {
    return {
      ...token,
      state: TOKEN_STATE_TO_GRPC[token.state]
    }
  }
}
