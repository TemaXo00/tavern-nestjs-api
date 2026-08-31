import { microserviceLaunch } from '@temaxo00/nx-nest-bootstrap'

import { AppModule } from './app.module'

microserviceLaunch<AppModule>({
  name: 'Log',
  module: AppModule,
  logs: true,
  rmq: true
})
