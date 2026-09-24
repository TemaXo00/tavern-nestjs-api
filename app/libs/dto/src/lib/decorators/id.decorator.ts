import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export function Id(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: `ID with UUID v7 format`,
      example: 'valid-uuid-v7',
      type: 'string',
    }),
    IsNotEmpty(),
    IsString(),
    IsUUID(7),
  );
}
