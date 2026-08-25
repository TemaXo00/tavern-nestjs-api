import { gatewayLaunch } from '@org/config-bootstrap';

import { AppModule } from './app.module';

void gatewayLaunch<AppModule>({
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
})
