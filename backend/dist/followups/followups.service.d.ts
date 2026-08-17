import { PrismaService } from '../prisma/prisma.service';
export declare class FollowupsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertLeadOwnership;
    create(userId: number, leadId: number, date: string, remark?: string): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }>;
    getByLead(userId: number, leadId: number): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }[]>;
    getAllForUser(userId: number): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }[]>;
    markCompleted(userId: number, id: number): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }>;
    getUpcoming(userId: number): Promise<({
        lead: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            phone: string;
            status: string;
            userId: number;
        };
    } & {
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    })[]>;
}
