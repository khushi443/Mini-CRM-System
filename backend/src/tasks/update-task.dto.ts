import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_STATUSES } from './create-task.dto';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: string;
}
