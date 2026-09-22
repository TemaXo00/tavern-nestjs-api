import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module'

microserviceLaunch<AppModule>({
  name: 'Log',
  module: AppModule,
  logs: true,
  rmq: true
})
