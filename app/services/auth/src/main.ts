import { microserviceLaunch } from '@temaxo00/nx-nest-bootstrap';

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'Auth',
  module: AppModule,
  logs: true,
  rmq: true
})