import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
    //private readonly TASKS_CACHE_KEY = 'tasks_cache_key';
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    private getCacheKey(userId: number): string {
        return `user:${userId}:tasks`;
    }

    async findAllTasks(userId: number) {
        /*
        return this.taskRepository.find({
            where: { user: { id: userId } }
        });
        */
        //console.log("consultando findAll")
        const key = this.getCacheKey(Number(userId));
        const cachedTasks = await this.cacheManager.get<Task[]>(key);
        if (cachedTasks) {
            return cachedTasks;
        }

        const tasks = await this.taskRepository.find({
            where: { user: { id: userId } },
        });
        await this.cacheManager.set(key, tasks); 

        return tasks;
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
        const task = this.taskRepository.create({
            ...dto,
            user: { id: userId }
        });
        
        const savedTask = await this.taskRepository.save(task);
        await this.cacheManager.del(this.getCacheKey(userId));
        return savedTask;
    }

    async editTask(taskId: number, dto: Partial<UpdateTaskDto>, userId: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { 
                id: taskId, 
                user: { id: userId }
            }
        });
        if (!task) {
            throw new NotFoundException(`Task #${taskId} not found`);
        }
        const updatedTask = this.taskRepository.merge(task, dto);
        await this.cacheManager.del(this.getCacheKey(userId));
        return this.taskRepository.save(updatedTask);
    }

    async deleteTask(taskId: number, userId: number): Promise<void> {
        const result = await this.taskRepository.delete({
            id: taskId,
            user: { id: userId }
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Task #${taskId} not found`);
        }
        await this.cacheManager.del(this.getCacheKey(userId));
    }
}