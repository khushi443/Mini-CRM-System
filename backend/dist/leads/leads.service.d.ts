import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllLeads(userId: number, status?: string): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }[]>;
    getLeadById(id: number, userId: number): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    createLead(userId: number, data: CreateLeadDto): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    updateLead(id: number, userId: number, data: Partial<CreateLeadDto>): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    deleteLead(id: number, userId: number): Promise<{
        message: string;
    }>;
    getAllLeadsForAdmin(): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
    } & {
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    })[]>;
}
