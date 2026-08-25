import { Module } from '@nestjs/common';

import {TasksFeatureController} from "./tasks-feature.controller";
import {TasksFeatureService} from "./tasks-feature.service";
import {TasksManipulate} from "./utils/tasks.manipulate";
import {TasksValidate} from "./utils/tasks.validate";

@Module({
  controllers: [
      TasksFeatureController
  ],
  providers: [
      TasksFeatureService,
      TasksManipulate,
      TasksValidate
  ],
  exports: [],
})
export class OrgTasksFeatureModule {}
