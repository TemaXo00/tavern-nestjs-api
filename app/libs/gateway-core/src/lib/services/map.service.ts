import { Injectable } from '@nestjs/common';
import {
  GRPC_TO_ROLE,
  GRPC_TO_TOKEN_STATE,
  TokenGatewayOutput,
  TokenOutput,
  UserEntity,
  UserEntityGateway,
} from '@org/types';

@Injectable()
export class GatewayMapService {
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

  mapAllTokensResponse(tokens: TokenOutput[]): TokenGatewayOutput[] {
    return tokens.map((token) => {
      return {
        ...token,
        state: GRPC_TO_TOKEN_STATE[token.state],
      };
    });
  }
}
