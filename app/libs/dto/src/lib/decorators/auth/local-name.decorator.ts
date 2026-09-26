import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function LocalName(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Local session name',
      example: 'My ASUS Session',
      type: 'string',
      minLength: 3,
      maxLength: 90,
    }),
    IsNotEmpty(),
    IsString(),
    Length(3, 90),
  );
}
