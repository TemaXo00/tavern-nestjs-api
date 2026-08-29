import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices'
import { AuthDatabaseService } from "@org/auth-database";
import * as argon2 from 'argon2'

@Injectable()
export class AuthValidateUtil {
  constructor(private readonly db: AuthDatabaseService) { }

  private async searchByEmail(email: string): Promise<{ id: string, email: string } | null> {
    return await this.db.user.findUnique({
        where: {
          email: email
        },
        select: {
          id: true,
          email: true
        }
      })
  }

  async validatePassword(passwordHash: string, inputPassword: string): Promise<void> {
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

  async validateRegisterEmailExists(email: string): Promise<void> {
    const isExists = await this.searchByEmail(email)

    if (isExists) {
      throw new RpcException({
        message: 'User with this email already exists',
        code: status.ALREADY_EXISTS
      })
    }
  }

  async validateEmailFound(email: string): Promise<void> {
    const isExists = await this.searchByEmail(email)

    if (!isExists) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND
      })
    }
  }
}
