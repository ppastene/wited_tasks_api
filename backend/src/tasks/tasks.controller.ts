import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Request, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAllTasks(req.user.sub);
    }

    @Get(':taskId')
    findTask(@Param('taskId', ParseIntPipe) taskId: number, @Request() req) {
        return this.tasksService.findTask(taskId, req.user.sub);
    }

    @Post()
    createTask(@Body() dto: CreateTaskDto, @Request() req) {
        return this.tasksService.createTask(dto, req.user.sub);
    }

    @Patch(':taskId')
    editTask(@Param('taskId', ParseIntPipe) taskId: number, @Body() dto: UpdateTaskDto, @Request() req) {
        return this.tasksService.editTask(taskId, dto, req.user.sub);
    }

    @Delete(':taskId')
    @HttpCode(204)
    deleteTask(@Param('taskId', ParseIntPipe) taskId: number, @Request() req) {
        return this.tasksService.deleteTask(taskId, req.user.sub);
    }
}