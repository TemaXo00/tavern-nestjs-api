import { microserviceLaunch } from '@temaxo00/nx-nest-bootstrap'

import { AppModule } from './app.module'

microserviceLaunch<AppModule>({
  name: 'Mail',
  module: AppModule,
  logs: true,
  rmq: true
})
