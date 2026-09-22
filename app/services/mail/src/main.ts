import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module'

microserviceLaunch<AppModule>({
  name: 'Mail',
  module: AppModule,
  logs: true,
  rmq: true
})
