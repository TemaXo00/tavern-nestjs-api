import { Injectable } from "@nestjs/common";
import { Token, User } from "@org/auth-database";
import { ROLE_TO_GRPC, TOKEN_STATE_TO_GRPC, TokenOutput, UserOutput } from "@org/types";

@Injectable()
export class AuthMapUtil {

  mapToken(token: Token): TokenOutput {
    return {
      ...token,
      state: TOKEN_STATE_TO_GRPC[token.state]
    }
  }

  mapUser(user: User): UserOutput {
    return {
      ...user,
      role: ROLE_TO_GRPC[user.role]
    }
  }
}
