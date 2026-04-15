import { IsString, MinLength, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'title must be 3 characters long' })
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEnum(TaskStatus, { message: 'status is not valid' })
  readonly status: TaskStatus;
}