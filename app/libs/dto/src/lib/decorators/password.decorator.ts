import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export function Password(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Password. Should have min 8 symbols, include 1 lowercase, 1 uppercase, 1 number',
      example: 'PassW1d1',
      type: 'string'
    }),
    IsNotEmpty(),
    IsString(),
    IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    })
  )
}
