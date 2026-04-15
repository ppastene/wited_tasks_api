import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    private readonly logger = new Logger(TasksService.name);

    private getCacheKey(userId: number): string {
        return `user:${userId}:tasks`;
    }

    async findAllTasks(userId: number, pagination: PaginationQueryDto) {
        const { page, limit } = pagination;
        const cacheKey = this.getCacheKey(Number(userId));

        this.logger.log({ userId, page, limit }, 'Iniciando búsqueda de tareas');
        let tasks = await this.cacheManager.get<Task[]>(cacheKey);
        
        if (!tasks) {
            this.logger.log({ userId, cacheKey }, 'Cache miss: Recuperando tareas desde la base de datos');
            tasks = await this.taskRepository.find({ where: { user: { id: userId } }});
            await this.cacheManager.set(cacheKey, tasks); 
        }
        else {
            this.logger.log({ userId, cacheKey }, 'Cache hit: Tareas recuperadas desde Redis');
        }

        if ( (!page || !limit) || tasks.length == 0 ) {
            return {
                items: tasks,
                meta: {
                    totalItems: tasks.length,
                    itemCount: tasks.length,
                    itemsPerPage: tasks.length,
                    totalPages: 1,
                    currentPage: 1,
                },
            };
        }

        const totalItems = tasks.length;
        const items = tasks.slice((page - 1) * limit, page * limit);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async findTask(taskId: number, userId: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { 
                id: taskId, 
                user: { id: userId }
            }
        });
        if (!task) {
            throw new NotFoundException(`Task #${taskId} not found`);
        }

        return task;
    }

    async createTask(dto: CreateTaskDto, userId: number): Promise<Task> {
        this.logger.log({ userId, title: dto.title }, 'Creando nueva tarea');
        const task = this.taskRepository.create({
            ...dto,
            user: { id: userId }
        });
        
        const savedTask = await this.taskRepository.save(task);
        await this.cacheManager.del(this.getCacheKey(userId));
        this.logger.log({ userId, taskId: savedTask.id }, 'Tarea creada e invalidación de cache exitosa');

        return savedTask;
    }

    async editTask(taskId: number, dto: Partial<UpdateTaskDto>, userId: number): Promise<Task> {
        this.logger.log({ userId, taskId }, 'Editando tarea');
        const task = await this.taskRepository.findOne({
            where: { 
                id: taskId, 
                user: { id: userId }
            }
        });
        if (!task) {
            this.logger.warn({ userId, taskId }, 'Intento de edición fallido: Tarea no encontrada');
            throw new NotFoundException(`Task #${taskId} not found`);
        }
        const updatedTask = this.taskRepository.merge(task, dto);
        await this.cacheManager.del(this.getCacheKey(userId));
        this.logger.log({ userId, taskId }, 'Tarea editada e invalidación de cache exitosa');

        return this.taskRepository.save(updatedTask);
    }

    async deleteTask(taskId: number, userId: number): Promise<void> {
        this.logger.log({ userId, taskId }, 'Eliminando tarea');
        const result = await this.taskRepository.delete({
            id: taskId,
            user: { id: userId }
        });

        if (result.affected === 0) {
            this.logger.warn({ userId, taskId }, 'Intento de eliminación fallido: Tarea no encontrada');
            throw new NotFoundException(`Task #${taskId} not found`);
        }
        await this.cacheManager.del(this.getCacheKey(userId));
        this.logger.log({ userId, taskId }, 'Tarea eliminada e invalidación de cache exitosa');
    }
}