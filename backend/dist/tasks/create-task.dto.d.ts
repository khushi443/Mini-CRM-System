export declare const TASK_STATUSES: readonly ["PENDING", "IN_PROGRESS", "COMPLETED"];
export declare class CreateTaskDto {
    title: string;
    dueDate?: string;
    status?: string;
}
