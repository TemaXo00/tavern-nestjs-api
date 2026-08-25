import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TasksFeatureService } from './tasks-feature.service';

import type { AllTasks, PatchTaskDescription, PatchTaskName, TaskById, TaskInput, TaskSchema, TasksContract } from '@org/types';

@Controller()
export class TasksFeatureController implements TasksContract {
    constructor(private readonly tasks: TasksFeatureService) {}

    @GrpcMethod('TaskService', 'FindAll')
    FindAll(): AllTasks {
        return this.tasks.FindAll();
    }

    @GrpcMethod('TaskService', 'FindById')
    FindById(meta: TaskById): TaskSchema {
        return this.tasks.FindById(meta);
    }

    @GrpcMethod('TaskService', 'CreateTask')
    CreateTask(dto: TaskInput): TaskSchema {
        return this.tasks.CreateTask(dto);
    }

    @GrpcMethod('TaskService', 'UpdateTask')
    UpdateTask(dto: TaskSchema): TaskSchema {
        return this.tasks.UpdateTask(dto);
    }

    @GrpcMethod('TaskService', 'ChangeName')
    ChangeName(dto: PatchTaskName): TaskSchema {
        return this.tasks.ChangeName(dto);
    }

    @GrpcMethod('TaskService', 'ChangeDescription')
    ChangeDescription(dto: PatchTaskDescription): TaskSchema {
        return this.tasks.ChangeDescription(dto);
    }

    @GrpcMethod('TaskService', 'DeleteTask')
    DeleteTask(data: TaskById): TaskSchema {
        return this.tasks.DeleteTask(data);
    }
}