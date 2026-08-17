import { PrismaService } from '../prisma/prisma.service';
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertLeadOwnership;
    create(userId: number, leadId: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        leadId: number;
    }>;
    getByLead(userId: number, leadId: number): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        leadId: number;
    }[]>;
}
