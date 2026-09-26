import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { isBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export function IsBlocked(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required ? IsNotEmpty() : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'Is blocked state',
      required: options.required,
      type: 'boolean',
      example: false,
    }),
    requiredDecorator,
    isBoolean,
  );
}
