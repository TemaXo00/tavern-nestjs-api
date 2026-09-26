import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { TokenPaginationDto } from '@org/dto';
import {
  Roles,
  type ValidateInput,
  type TokenServiceObservableContract,
  type AllTokensGateway,
  TokenGatewayOutput,
} from '@org/types';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { GETProtectedMethod } from '../../decorators/methods/get-method.decorator';
import { QUERYProtectedMethod } from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { AuthGatewayMapService } from '../../services/map/auth-map.service';

import type { ClientGrpc } from '@nestjs/microservices';

@HTTPController({
  microserviceName: 'Auth',
  serviceName: 'Token',
})
export class TokenController implements OnModuleInit {
  private tokenContract!: TokenServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.tokenContract =
      this.client.getService<TokenServiceObservableContract>('TokenService');
  }

  @QUERYProtectedMethod({
    path: '',
    operationDesc: 'Get all tokens with pagination',
  })
  async getTokensWithPagination(
    @Body() pagination: TokenPaginationDto,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<AllTokensGateway> {
    const response = await firstValueFrom(
      this.tokenContract.GetTokensWithPagination({
        validation,
        pagination: this.map.mapTokenPaginationRequest(pagination),
      }),
    );

    return {
      pagination: this.map.mapTokenPaginationResponse(response.pagination),
      tokens: this.map.mapAllTokensResponse(response.tokens),
    };
  }

  @GETProtectedMethod({
    path: ':id',
    operationDesc: 'Returns token by ID. Only admin method',
    roles: [Roles.ADMIN],
  })
  async getTokenById(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<TokenGatewayOutput> {
    const response = await firstValueFrom(
      this.tokenContract.GetTokenById({ id, validation }),
    );
    return this.map.mapTokenResponse(response);
  }
}
