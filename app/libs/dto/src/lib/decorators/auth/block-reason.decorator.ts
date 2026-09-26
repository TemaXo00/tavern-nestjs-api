import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function BlockReason(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Block reason for blocking user',
      example: 'Does not follow rules',
      type: 'string',
      minLength: 3,
      maxLength: 800,
    }),
    IsNotEmpty(),
    IsString(),
    Length(3, 800),
  );
}
