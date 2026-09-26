import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export function Limit(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      name: 'limit',
      description: 'Limit of pagination',
      example: 10,
      required: false,
      type: 'number',
    }),
    IsOptional(),
    IsNumber(),
    Min(1),
  );
}
