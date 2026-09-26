import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export function Email(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User email',
      type: 'string',
      example: 'user@example.com',
    }),
    IsNotEmpty(),
    IsString(),
    MinLength(3),
    IsEmail({
      allow_ip_domain: false,
    }),
  );
}
