import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const startTime = Date.now();

    const { method, url, ip, query, params, body } = request;

    this.logger.error(`X ${method} ${url} - Error occurred`);
    this.logger.error(`  IP: ${ip || request.socket?.remoteAddress || 'unknown'}`);

    if (Object.keys(query).length > 0) {
      this.logger.error(`  Query: ${JSON.stringify(query)}`);
    }

    if (Object.keys(params).length > 0) {
      this.logger.error(`  Params: ${JSON.stringify(params)}`);
    }

    if (body && Object.keys(body).length > 0) {
      this.logger.error(`  Body: ${JSON.stringify(body).substring(0, 500)}`);
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as {
          message?: string | string[];
          statusCode?: number;
        };
        message = Array.isArray(responseObj.message)
          ? responseObj.message.join(', ')
          : responseObj.message || exception.message;

        if (responseObj.statusCode) {
          status = responseObj.statusCode;
        }
      } else {
        message = exception.message;
      }

      this.logger.error(`  HTTP Status: ${status}`);
      this.logger.error(`  Message: ${message}`);
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`  Error: ${message}`);
      this.logger.error(`  Stack: ${exception.stack}`);
    } else {
      this.logger.error(`  Unknown error: ${String(exception)}`);
    }

    const duration = Date.now() - startTime;
    this.logger.error(`  Duration: ${duration}ms`);

    response.status(status).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      path: url,
      method: method,
      message: message,
      duration: `${duration}ms`,
    });
  }
}
