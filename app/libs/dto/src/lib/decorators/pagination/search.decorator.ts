import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export function Search(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Pagination search query',
      example: 'User',
      type: 'string',
      required: false,
      minLength: 3,
      maxLength: 90,
    }),
    IsOptional(),
    IsString(),
    Length(3, 90),
  );
}
