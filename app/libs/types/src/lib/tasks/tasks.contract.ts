import {AllTasks, PatchTaskDescription, PatchTaskName, TaskById, TaskInput} from "./tasks.data.js";
import {TaskSchema} from "./tasks.entites.js";
import {Empty} from "../shared/empty.type.js";

export interface TasksContract {
    FindAll(empty: Empty): AllTasks;
    FindById(meta: TaskById): TaskSchema;
    CreateTask(dto: TaskInput): TaskSchema;
    UpdateTask(data: TaskSchema): TaskSchema;
    ChangeName(data: PatchTaskName): TaskSchema;
    ChangeDescription(data: PatchTaskDescription): TaskSchema;
    DeleteTask(data: TaskById): TaskSchema;
}