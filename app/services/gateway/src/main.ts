import { monolithLaunch } from '@org/bootstrap';

import { AppModule } from './app.module';

void monolithLaunch<AppModule>({
  name: 'Gateway',
  module: AppModule,
  logs: true,
  globalPrefix: 'api',
  validation: true,
  interceptors: true,
  rateLimit: true,
  filters: true,
  cors: true,
  swagger: true,
  compression: true,
});
