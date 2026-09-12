import { Injectable } from "@nestjs/common";
import { AuthValidateService } from "@org/auth-core";
import { Token } from "@org/auth-database";
import { AuthDatabaseUtil, AuthMessagesUtil, AuthValidateUtil } from "@org/auth-utils";
import { AllTokensOutput, DeleteAllNotActiveTokensInput, DeleteTokenInput, Empty, GetTokensInput, RevokeTokenInput, Roles, TOKEN_STATE_TO_GRPC, TokenByIdInput, TokenOutput, TokenServiceContract, TokenStates } from '@org/types'

@Injectable()
export class TokenFeatureService implements TokenServiceContract {
  constructor(
    private readonly validation: AuthValidateService,
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil,
    private readonly messagesUtil: AuthMessagesUtil
  ) {}

  async GetTokensWithPagination(data: GetTokensInput): Promise<AllTokensOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    this.messagesUtil.sendAdminCheckTokens({id: payload.id, pagination: data.pagination})
    return await this.dbUtil.getPaginatedTokens(data.pagination)
  }

  async GetTokenById(data: TokenByIdInput): Promise<TokenOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const token = await this.validateUtil.validateTokenFound(data.id, 'id')
    this.messagesUtil.sendAdminGetToken({adminId: payload.id, tokenId: data.id})
    return this.mapToken(token)
  }

  async SetTokenRevoked(data: RevokeTokenInput): Promise<TokenOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateTokenFound(data.id, 'id')
    const token = await this.dbUtil.updateTokenState(data.id, TokenStates.REVOKED)
    this.messagesUtil.sendAdminRevokeToken({adminId: payload.id, tokenId: data.id})
    return this.mapToken(token)
  }

  async DeleteTokenById(data: DeleteTokenInput): Promise<TokenOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateTokenFound(data.id, 'id')
    const token = await this.dbUtil.removeToken(data.id)
    this.messagesUtil.sendAdminDeleteToken({adminId: payload.id, tokenId: data.id})
    return this.mapToken(token)
  }

  async DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Promise<Empty> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    const deleteAmount = await this.dbUtil.removeInactiveTokens()
    this.messagesUtil.sendAdminDeleteInactiveTokens({adminId: payload.id, tokensAmount: deleteAmount})
    return {}
  }

  private mapToken(token: Token): TokenOutput {
    return {
      ...token,
      state: TOKEN_STATE_TO_GRPC[token.state]
    }
  }
}
