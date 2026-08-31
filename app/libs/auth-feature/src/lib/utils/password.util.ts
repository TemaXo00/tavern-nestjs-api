import { status } from "@grpc/grpc-js";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import * as argon2 from 'argon2'

@Injectable()
export class AuthPasswordUtil {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id
    })
  }

  async validatePassword(passwordHash: string | null, inputPassword: string): Promise<void> {
    if (!passwordHash) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }

    const isValid = await argon2.verify(passwordHash, inputPassword)

    if (!isValid) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
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
}
