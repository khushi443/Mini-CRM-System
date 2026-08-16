import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: string;
}
