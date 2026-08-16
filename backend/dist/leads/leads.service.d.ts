import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllLeads(userId: number, status?: string): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }[]>;
    getLeadById(id: number, userId: number): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    createLead(userId: number, data: CreateLeadDto): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    updateLead(id: number, userId: number, data: Partial<CreateLeadDto>): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    deleteLead(id: number, userId: number): Promise<{
        message: string;
    }>;
    getAllLeadsForAdmin(): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    })[]>;
}
