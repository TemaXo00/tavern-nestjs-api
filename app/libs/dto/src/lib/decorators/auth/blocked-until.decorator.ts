import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';

export function BlockedUntil(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Set blocked until date and time',
      example: '2026-09-26T09:00:00.000Z',
      type: 'string',
      format: 'date-time',
    }),
    Type(() => Date),
    IsNotEmpty(),
    IsDate(),
    MinDate(() => new Date()),
  );
}
