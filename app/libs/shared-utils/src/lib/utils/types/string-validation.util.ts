import { status } from '@grpc/grpc-js'
import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class StringValidationUtil {
  validateId(id: string): void {
    if (!id || !this.validateUUIDV7(id)) {
      this.throwRPCError('ID')
    }
  }

  validateEmail(email: string): void {
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.throwRPCError('Email')
    }
  }

  validateAnyString(value: string, type: string): void {
    if (!value) {
      this.throwRPCError(type)
    }
  }

  validateUUIDV7(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  }

  private throwRPCError(arg: string): void {
    throw new RpcException({
      message: `Invalid ${arg}`,
      code: status.INVALID_ARGUMENT
    })
  }
}
