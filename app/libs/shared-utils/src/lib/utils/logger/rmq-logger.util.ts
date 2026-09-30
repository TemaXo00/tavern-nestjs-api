import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RmqLoggerUtil {
  private readonly logger = new Logger('RMQ');

  logSuccess(context: string, method: string, details?: string): void {
    const detailsStr = details ? `. Details: ${details}` : '';
    this.logger.log(`[${context}] ${method} handled successfully${detailsStr}`);
  }

  logError(context: string, method: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(
      `[${context}] ${method} failed. Reason: ${message}`,
      stack,
    );
  }

  logWarning(context: string, method: string, reason: string): void {
    this.logger.warn(`[${context}] ${method} skipped. Reason: ${reason}`);
  }
}
