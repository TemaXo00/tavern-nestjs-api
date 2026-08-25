import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post, Put } from '@nestjs/common';

import type { ClientGrpc } from '@nestjs/microservices';
import type { AllTasks, PatchTaskDescription, PatchTaskName, TaskInput, TaskSchema, TasksContract } from '@org/types';

@Controller('tasks')
export class TasksController implements OnModuleInit {
    private taskService!: TasksContract;

    constructor(@Inject('TASKS_SERVICE') private readonly client: ClientGrpc) {
    }

    onModuleInit(): void {
        this.taskService = this.client.getService('TaskService');
    }

    @Get()
    async FindAll(): Promise<AllTasks> {
        return this.taskService.FindAll({});
    }

    @Get(':id')
    async FindOne(@Param('id') id: number): Promise<TaskSchema> {
        return this.taskService.FindById({id: id});
    }

    @Post()
    async CreateTask(@Body() dto: TaskInput): Promise<TaskSchema> {
        return this.taskService.CreateTask(dto);
    }

    @Put(':id')
    async UpdateTask(@Param('id') id: number, @Body() dto: TaskInput): Promise<TaskSchema> {
        return this.taskService.UpdateTask({id: id, ...dto});
    }

    @Patch(':id/name')
    async ChangeName(@Param('id') id: number, @Body() dto: PatchTaskName): Promise<TaskSchema> {
        return this.taskService.ChangeName({id: id, name: dto.name});
    }

    @Patch(':id/description')
    async ChangeDescription(@Param('id') id: number, @Body() dto: PatchTaskDescription): Promise<TaskSchema> {
        return this.taskService.ChangeDescription({id: id, description: dto.description});
    }

    @Delete(':id')
    async DeleteTask(@Param('id') id: number): Promise<TaskSchema> {
        return this.taskService.DeleteTask({id: id});
    }
}