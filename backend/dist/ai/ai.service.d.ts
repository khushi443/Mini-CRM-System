import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private prisma;
    constructor(prisma: PrismaService);
    ask(userId: number, question: string): Promise<{
        answer: string;
        basedOn: string;
    }>;
    private followUpInsight;
    private valueInsight;
    private priorityInsight;
    private pipelineSummary;
    private countByStatus;
}
