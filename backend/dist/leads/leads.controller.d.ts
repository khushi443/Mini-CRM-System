import { LeadsService } from './leads.service';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadsController {
    private leadsService;
    constructor(leadsService: LeadsService);
    getAllLeads(req: any, status?: string): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }[]>;
    getAllLeadsAdmin(): Promise<({
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
    getLead(id: string, req: any): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    createLead(body: CreateLeadDto, req: any): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    updateLead(id: string, body: Partial<CreateLeadDto>, req: any): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        id: number;
        phone: string;
        status: string;
        userId: number;
    }>;
    deleteLead(id: string, req: any): Promise<{
        message: string;
    }>;
}
