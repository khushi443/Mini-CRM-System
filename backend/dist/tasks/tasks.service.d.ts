import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: number, data: CreateTaskDto): Promise<{
        id: number;
        createdAt: Date;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    getTasks(userId: number): Promise<{
        id: number;
        createdAt: Date;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }[]>;
    updateTask(id: number, userId: number, data: UpdateTaskDto): Promise<{
        id: number;
        createdAt: Date;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    deleteTask(id: number, userId: number): Promise<{
        message: string;
    }>;
}
