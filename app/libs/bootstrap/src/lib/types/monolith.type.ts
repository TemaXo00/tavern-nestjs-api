import { Type } from '@nestjs/common';

export interface MonolithBootstrapOptions<T> {
  name: string;

  module: Type<T>;

  logs?: boolean;

  globalPrefix?: string;

  validation?: boolean;
  interceptors?: boolean;
  filters?: boolean;

  compression?: boolean;
  rateLimit?: boolean;

  cors?: boolean;

  swagger?: boolean;
}
