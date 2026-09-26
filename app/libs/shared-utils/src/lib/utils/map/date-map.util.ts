import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DateMapUtil {
  mapDateAndValidate(date: string | Date): Date {
    const correctDate = date instanceof Date ? date : new Date(date);

    if (isNaN(correctDate.getTime())) {
      throw new RpcException({
        message: 'Invalid date',
        code: status.INVALID_ARGUMENT,
      });
    }

    return correctDate;
  }
}
