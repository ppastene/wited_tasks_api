import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Request, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    @ApiOperation({ summary: 'Encontrar todas las tareas' })
    findAll(@Request() req) {
        return this.tasksService.findAllTasks(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Encontrar una tarea' })
    @ApiParam({ name: 'id', description: 'ID de la tarea a buscar' })
    @ApiResponse({ status: 200, description: 'Tarea encontrada' })
    @ApiResponse({ status: 404, description: 'No se encontró la tarea' })
    findTask(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.tasksService.findTask(id, req.user.sub);
    }

    @Post()
    @ApiOperation({ summary: 'Crear una tarea' })
    @ApiResponse({ status: 202, description: 'Tarea creada exitosamente' })
    createTask(@Body() dto: CreateTaskDto, @Request() req) {
        return this.tasksService.createTask(dto, req.user.sub);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una tarea' })
    @ApiParam({ name: 'id', description: 'ID de la tarea a actualizar' })
    @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
    @ApiResponse({ status: 404, description: 'No se encontró la tarea' })
    editTask(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto, @Request() req) {
        return this.tasksService.editTask(id, dto, req.user.sub);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una tarea' })
    @ApiParam({ name: 'id', description: 'ID de la tarea a eliminar' })
    @ApiResponse({ status: 200, description: 'Tarea eliminada correctamente' })
    @ApiResponse({ status: 404, description: 'La tarea no existe' })
    @HttpCode(204)
    deleteTask(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.tasksService.deleteTask(id, req.user.sub);
    }
}