import {Injectable} from "@nestjs/common";
import {AllTasks, TaskInput, TaskSchema} from "@org/types";

@Injectable()
export class TasksManipulate {
    createTask(tasks: AllTasks, data: TaskSchema): TaskSchema[] {
        tasks.items.push(data)
        return tasks.items;
    }

    removeTask(tasks: AllTasks, id: number): TaskSchema[] {
        return tasks.items.filter(item => item.id !== id)
    }

    changeTaskName(task: TaskSchema, name: string): TaskSchema {
        task.name = name
        return task;
    }

    changeTaskDescription(task: TaskSchema, description: string): TaskSchema {
        task.description = description
        return task;
    }

    changeTaskData(task: TaskSchema, data: TaskInput): TaskSchema {
        task.name = data.name;
        task.description = data.description;
        return task;
    }
}