import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export function Page(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      name: 'page',
      description: 'Page of pagination',
      example: 1,
      required: false,
      type: 'number',
    }),
    IsOptional(),
    IsNumber(),
    Min(1),
  );
}
