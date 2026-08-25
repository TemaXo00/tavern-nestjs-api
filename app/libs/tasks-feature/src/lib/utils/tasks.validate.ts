import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { AllTasks, TaskSchema } from '@org/types'

@Injectable()
export class TasksValidate {

    checkExistingTasks(tasks: AllTasks): void {
        if (!tasks || tasks.items.length === 0) {
            throw new NotFoundException('No tasks found');
        }
    }

    private searchTaskById(id: number, tasks: AllTasks): TaskSchema | undefined {
        return tasks.items.find(t => t.id === id)
    }

    private searchTaskByName(name: string, tasks: AllTasks): TaskSchema | undefined {
        return tasks.items.find(t => t.name === name)
    }

    validateTaskExists(id: number, tasks: AllTasks): TaskSchema {
        this.checkExistingTasks(tasks);

        const existing = this.searchTaskById(id, tasks)

        if (!existing) {
            throw new NotFoundException(`Task with id ${id} not found`)
        }

        return existing;
    }

    validateTaskWithNameExists(name: string, tasks: AllTasks): void {
        const existing = this.searchTaskByName(name, tasks)

        if (existing) {
            throw new ConflictException(`Task with name ${name} found. Enter another name`)
        }
    }
}