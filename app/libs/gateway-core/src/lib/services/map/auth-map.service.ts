import { Injectable } from '@nestjs/common';
import {
  GRPC_TO_ROLE,
  GRPC_TO_TOKEN_STATE,
  TOKEN_STATE_TO_GRPC,
  TokenGatewayOutput,
  TokenOutput,
  TokenPaginationInput,
  TokenPaginationInputGateway,
  TokenPaginationOutput,
  TokenPaginationOutputGateway,
  UserEntity,
  UserEntityGateway,
} from '@org/types';

@Injectable()
export class AuthGatewayMapService {
  mapUser(user: UserEntity): UserEntityGateway {
    return {
      ...user,
      role: GRPC_TO_ROLE[user.role],
    };
  }

  mapTokenResponse(token: TokenOutput): TokenGatewayOutput {
    return {
      ...token,
      state: GRPC_TO_TOKEN_STATE[token.state],
    };
  }

  mapAllTokensResponse(tokens?: TokenOutput[]): TokenGatewayOutput[] {
    if (!tokens || !Array.isArray(tokens)) {
      return [];
    }
    return tokens.map((token) => ({
      ...token,
      state: GRPC_TO_TOKEN_STATE[token.state],
    }));
  }

  mapTokenPaginationResponse(
    pagination: TokenPaginationOutput,
  ): TokenPaginationOutputGateway {
    return {
      ...pagination,
      state: pagination.state
        ? GRPC_TO_TOKEN_STATE[pagination.state]
        : undefined,
    };
  }

  mapTokenPaginationRequest(
    pagination: TokenPaginationInputGateway,
  ): TokenPaginationInput {
    return {
      ...pagination,
      state: pagination.state
        ? TOKEN_STATE_TO_GRPC[pagination.state]
        : undefined,
    };
  }
}
