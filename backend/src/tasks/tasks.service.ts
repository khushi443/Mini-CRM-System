import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async createTask(userId: number, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // ✅ GET ALL
  async getTasks(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  // ✅ UPDATE
  async updateTask(id: number, userId: number, data: Partial<CreateTaskDto>) {
    const existing = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  // ✅ DELETE
  async deleteTask(id: number, userId: number) {
    const existing = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted' };
  }
}