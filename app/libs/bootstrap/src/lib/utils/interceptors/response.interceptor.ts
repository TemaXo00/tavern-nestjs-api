import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {ResponseType} from "../../types/response.type.js";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseType<T>
> {
  private readonly logger = new Logger('ResponseInterceptor');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseType<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;
    const path = url;
    const dateNow = new Date().toLocaleDateString();
    const timeNow = new Date().toLocaleTimeString();
    const now = Date.now();

    this.logger.log(`[${method}] ${url} - Processing request`);
    this.logger.log(
      `  IP: ${ip || request.socket?.remoteAddress || 'unknown'}`,
    );

    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - now;
        const statusCode = response.statusCode || 200;

        this.logger.log(
          `[${method}] ${url} - Completed with status ${statusCode} in ${duration}ms`,
        );

        return {
          status: 'success',
          date: dateNow,
          time: timeNow,
          path: path,
          data: data,
          duration: `${duration}ms`,
        };
      }),
    );
  }
}
