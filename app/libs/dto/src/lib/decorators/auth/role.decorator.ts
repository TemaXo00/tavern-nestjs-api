import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@org/types';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export function Role(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required ? IsNotEmpty() : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'User role',
      required: options.required,
      enum: Roles,
    }),
    requiredDecorator,
    IsEnum(Roles),
  );
}
