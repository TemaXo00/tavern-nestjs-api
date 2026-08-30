import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices'
import { AuthDatabaseService, User } from "@org/auth-database";
import { UserPayload } from '@org/types';
import * as argon2 from 'argon2'

import { AuthJWTUtil } from './jwt.util';

@Injectable()
export class AuthValidateUtil {
  constructor(
    private readonly db: AuthDatabaseService,
    private readonly jwt: AuthJWTUtil
  ) {}

  private async searchByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
        where: {
          email: email
        },
      })
  }

  async validatePassword(passwordHash: string | null, inputPassword: string): Promise<void> {
    if (!passwordHash) {
      throw new RpcException({
        message: 'User not found',
        code: status.UNAUTHENTICATED
      })
    }

    const isValid = await argon2.verify(passwordHash, inputPassword)

    if (!isValid) {
      throw new RpcException({
        message: 'User not found',
        code: status.UNAUTHENTICATED
      })
    }
  }

  async validateToken(tokenHash: string, token: string): Promise<void> {
    const isValid = await argon2.verify(tokenHash, token)

    if (!isValid) {
      throw new RpcException({
        message: 'Token invalid',
        code: status.UNAUTHENTICATED
      })
    }
  }

  validatePasswordInput(password: string, passwordConfirmation: string): void {
    if (password !== passwordConfirmation) {
      throw new RpcException({
        message: 'Passwords not similar',
        code: status.INVALID_ARGUMENT
      })
    }
  }

  async validateRegisterEmailExists(email: string): Promise<void> {
    const isExists = await this.searchByEmail(email)

    if (isExists) {
      throw new RpcException({
        message: 'User with this email already exists',
        code: status.ALREADY_EXISTS
      })
    }
  }

  async validateEmailFound(email: string): Promise<User> {
    const isExists = await this.searchByEmail(email)

    if (!isExists) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return isExists
  }

  validateAccessToken(accessToken: string): UserPayload {
    try {
      const payload = this.jwt.verifyToken(accessToken)
      return {
        id: payload.id,
        sessionId: payload.sessionId,
        role: payload.role
      }
    }
    catch (error) {
      let message = 'Invalid or expired access token';

      if (error instanceof TokenExpiredError) {
        message = 'Access token has expired';
      } else if (error instanceof JsonWebTokenError) {
        message = 'Invalid access token';
      }

      throw new RpcException({
        message,
        code: status.UNAUTHENTICATED,
      });
    }
  }
}
