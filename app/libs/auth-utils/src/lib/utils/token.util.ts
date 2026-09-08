import {randomBytes} from 'node:crypto'

import { status } from '@grpc/grpc-js';
import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices';
import { StringValidationUtil } from '@org/shared-utils';
import * as argon2 from 'argon2'

@Injectable()
export class AuthTokenUtil {

  constructor(private readonly stringUtil: StringValidationUtil) {}

  async generateTokens(): Promise<{token: string, hashToken: string}> {
    const token = randomBytes(48).toString()
    const hashToken = await argon2.hash(token, {
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id
    })
    return {token, hashToken}
  }

  async validateTokenHash(token: string, tokenHash: string): Promise<void> {
    this.stringUtil.validateAnyString(token, 'Token')
    const isValid = await argon2.verify(token, tokenHash)

    if (!isValid) {
      throw new RpcException({
        message: 'Invalid token',
        code: status.UNAUTHENTICATED
      })
    }
  }
}
