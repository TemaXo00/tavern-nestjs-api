import { Injectable } from '@nestjs/common';
import {
  GRPC_TO_ROLE,
  GRPC_TO_TOKEN_STATE,
  ROLE_TO_GRPC,
  TOKEN_STATE_TO_GRPC,
  TokenGatewayOutput,
  TokenOutput,
  TokenPaginationInput,
  TokenPaginationInputGateway,
  TokenPaginationOutput,
  TokenPaginationOutputGateway,
  UserEntity,
  UserEntityGateway,
  UserGatewayOutput,
  UserOutput,
  UserPaginationGatewayInput,
  UserPaginationGatewayOutput,
  UserPaginationInput,
  UserPaginationOutput,
} from '@org/types';

@Injectable()
export class AuthGatewayMapService {
  mapUserEntity(user: UserEntity): UserEntityGateway {
    return {
      ...user,
      role: GRPC_TO_ROLE[user.role],
    };
  }

  mapUserPaginationRequest(
    pagination: UserPaginationGatewayInput,
  ): UserPaginationInput {
    return {
      ...pagination,
      role: pagination.role ? ROLE_TO_GRPC[pagination.role] : undefined,
    };
  }

  mapUserPaginationResponse(
    pagination: UserPaginationOutput,
  ): UserPaginationGatewayOutput {
    return {
      ...pagination,
      role: pagination.role ? GRPC_TO_ROLE[pagination.role] : undefined,
    };
  }

  mapAllUsersResponse(users?: UserOutput[]): UserGatewayOutput[] {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    return users.map((user) => ({
      ...user,
      role: GRPC_TO_ROLE[user.role],
    }));
  }

  mapUserResponse(user: UserOutput): UserGatewayOutput {
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
