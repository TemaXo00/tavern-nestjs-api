import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TokenStates } from '@org/types';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export function TokenState(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required ? IsNotEmpty() : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'Token state for token',
      required: options.required,
      enum: TokenStates,
    }),
    requiredDecorator,
    IsEnum(TokenStates),
  );
}
