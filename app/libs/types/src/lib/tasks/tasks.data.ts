import {TaskSchema} from "./tasks.entites.js";

export interface TaskInput {
    name: string;
    description: string;
}

export interface TaskById {
    id: number;
}

export interface PatchTaskName {
    id: number;
    name: string;
}

export interface PatchTaskDescription {
    id: number;
    description: string;
}

export interface AllTasks {
    items: TaskSchema[];
}