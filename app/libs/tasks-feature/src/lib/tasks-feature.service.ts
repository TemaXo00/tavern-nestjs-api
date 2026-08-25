import { Injectable } from '@nestjs/common';
import { AllTasks, PatchTaskDescription, PatchTaskName, TaskById, TaskInput, TaskSchema, TasksContract } from '@org/types';

import { TasksManipulate } from './utils/tasks.manipulate';
import { TasksValidate } from './utils/tasks.validate';

@Injectable()
export class TasksFeatureService implements TasksContract {
    private tasks: AllTasks = { items: [] };
    private taskId = 1;

    constructor(
        private readonly validation: TasksValidate,
        private readonly manipulate: TasksManipulate,
    ) {}

    FindAll(): AllTasks {
        return this.tasks;
    }

    FindById(meta: TaskById): TaskSchema {
        return this.validation.validateTaskExists(meta.id, this.tasks);
    }

    CreateTask(dto: TaskInput): TaskSchema {
        this.validation.validateTaskWithNameExists(dto.name, this.tasks);
        const newTask: TaskSchema = {
            id: this.taskId,
            ...dto,
        };
        this.tasks.items = this.manipulate.createTask(this.tasks, newTask);
        this.taskId++;
        return newTask;
    }

    UpdateTask(dto: TaskSchema): TaskSchema {
        const task = this.validation.validateTaskExists(dto.id, this.tasks);
        return this.manipulate.changeTaskData(task, dto);
    }

    ChangeName(dto: PatchTaskName): TaskSchema {
        const task = this.validation.validateTaskExists(dto.id, this.tasks);
        return this.manipulate.changeTaskName(task, dto.name);
    }

    ChangeDescription(dto: PatchTaskDescription): TaskSchema {
        const task = this.validation.validateTaskExists(dto.id, this.tasks);
        return this.manipulate.changeTaskDescription(task, dto.description);
    }

    DeleteTask(data: TaskById): TaskSchema {
        const task = this.validation.validateTaskExists(data.id, this.tasks);
        this.tasks.items = this.manipulate.removeTask(this.tasks, data.id);
        return task;
    }
}