import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type SendFunction = (body: unknown) => Response;

export function loggingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  const logger = new Logger('HTTP');
  const { method, originalUrl, ip, query, params } = req;
  const start = Date.now();

  logger.log(`→ ${method} ${originalUrl}`);
  logger.log(`  IP: ${ip || req.socket?.remoteAddress || 'unknown'}`);

  if (Object.keys(query).length > 0) {
    logger.log(`  Query: ${JSON.stringify(query)}`);
  }

  if (Object.keys(params).length > 0) {
    logger.log(`  Params: ${JSON.stringify(params)}`);
  }

  let responseBody = '';

  const originalSend = res.send.bind(res) as SendFunction;

  res.send = function (chunk: unknown): Response {
    if (chunk) {
      try {
        const parsed = typeof chunk === 'string' ? JSON.parse(chunk) : chunk;
        responseBody = JSON.stringify(parsed).substring(0, 1000);
      } catch {
        responseBody = String(chunk).substring(0, 1000);
      }
    }
    return originalSend(chunk);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logMessage = `← ${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(logMessage);
      if (responseBody) {
        logger.error(`  Response: ${responseBody}`);
      }
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
      if (responseBody) {
        logger.warn(`  Response: ${responseBody}`);
      }
    } else {
      logger.log(logMessage);
    }
  });

  next();
}