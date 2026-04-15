import { IsString, MinLength, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'title must be 3 characters long' })
  @ApiProperty({ example: 'Terminar el README', description: 'El título de la tarea' })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Agregar instrucciones de Docker y validar que aquello funcione', required: false })
  readonly description: string;

  @IsEnum(TaskStatus, { message: 'status is not valid' })
  @ApiProperty({ example: "pending", description: 'Estado de la tarea. Valores permitidos: pending, in_progress, done' })
  readonly status: TaskStatus;
}