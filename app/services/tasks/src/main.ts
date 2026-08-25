import { microserviceLaunch } from '@org/config-bootstrap'

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'Tasks',
  module: AppModule,
  logs: true,
})