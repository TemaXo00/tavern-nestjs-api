import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices'
import { User } from '@org/auth-database';
import { UserPayload } from '@org/types';
import * as argon2 from 'argon2'

import { AuthDatabaseUtil } from './database.util';
import { AuthJWTUtil } from './jwt.util';

@Injectable()
export class AuthValidateUtil {
  constructor(
    private readonly db: AuthDatabaseUtil,
    private readonly jwt: AuthJWTUtil
  ) { }

  // EMAIL Validation

  async validateRegisterEmailExists(email: string): Promise<void> {
    const isExists = await this.db.searchByEmail(email)

    if (isExists) {
      throw new RpcException({
        message: 'User with this email already exists',
        code: status.ALREADY_EXISTS
      })
    }
  }

  async validateEmailFound(email: string): Promise<User> {
    const isExists = await this.db.searchByEmail(email)

    if (!isExists) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return isExists
  }

  // TOKEN Validation

  async validateRefreshToken(tokenHash: string, token: string): Promise<void> {
    const isValid = await argon2.verify(tokenHash, token)

    if (!isValid) {
      throw new RpcException({
        message: 'Token invalid',
        code: status.UNAUTHENTICATED
      })
    }
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

  // USER Validation

  async validateUserExists(id: string): Promise<User> {
    const user = await this.db.searchById(id)

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    return user
  }

  async validateUserBLock(id: string): Promise<void> {
    const user = await this.validateUserExists(id)
    const date = new Date()

    if (user.isBlocked && user.blockedUntil && user.blockReason) {
      if (user.blockedUntil <= date) {
        throw new RpcException({
          message: `User blocked until: ${user.blockedUntil.toDateString()}. Block reason: ${user.blockReason}`,
          code: status.UNAVAILABLE
        })
      }
      else {
        await this.db.unblockUser(id)
      }
    }
  }
}
