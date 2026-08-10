import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './create-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // ✅ CREATE
  @Post()
  create(@Body() body: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(req.user.userId, body);
  }

  // ✅ GET ALL
  @Get()
  getAll(@Req() req) {
    return this.tasksService.getTasks(req.user.userId);
  }

  // ✅ UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req) {
    return this.tasksService.updateTask(
      Number(id),
      req.user.userId,
      body,
    );
  }

  // ✅ DELETE
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.tasksService.deleteTask(
      Number(id),
      req.user.userId,
    );
  }
}