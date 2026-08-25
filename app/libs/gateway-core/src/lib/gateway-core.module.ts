import { join } from 'path'

import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {workspaceRoot} from "nx/src/utils/workspace-root";

import {TasksController} from "./controllers/tasks/tasks.controller";

@Module({
  imports: [
      ClientsModule.register([
        {
          name: 'TASKS_SERVICE',
          transport: Transport.GRPC,
          options: {
            protoPath: join(workspaceRoot, 'proto/tasks.proto'),
            package: 'tasks',
            url: '0.0.0.0:5000'
          }
        }
      ])
  ],
  controllers: [
      TasksController
  ],
  providers: [],
  exports: [],
})
export class OrgGatewayCoreModule {}
