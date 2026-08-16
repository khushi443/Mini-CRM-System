import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(body: CreateTaskDto, req: any): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    getAll(req: any): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }[]>;
    update(id: string, body: UpdateTaskDto, req: any): Promise<{
        createdAt: Date;
        id: number;
        status: string;
        userId: number;
        title: string;
        dueDate: Date | null;
    }>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
