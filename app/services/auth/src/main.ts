import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'Auth',
  module: AppModule,
  logs: true,
  rmq: true
})
