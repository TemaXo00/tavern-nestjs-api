import {microserviceLaunch} from "@temaxo00/nx-nest-bootstrap";

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'Tasks',
  module: AppModule,
  logs: true,
})