import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: number, data: CreateTaskDto): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    getTasks(userId: number): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }[]>;
    updateTask(id: number, userId: number, data: UpdateTaskDto): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    deleteTask(id: number, userId: number): Promise<{
        message: string;
    }>;
}
