import { LeadsService } from './leads.service';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadsController {
    private leadsService;
    constructor(leadsService: LeadsService);
    getAllLeads(req: any, status?: string): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }[]>;
    getAllLeadsAdmin(): Promise<({
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
    getLead(id: string, req: any): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    createLead(body: CreateLeadDto, req: any): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    updateLead(id: string, body: Partial<CreateLeadDto>, req: any): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        phone: string;
        status: string;
        userId: number;
    }>;
    deleteLead(id: string, req: any): Promise<{
        message: string;
    }>;
}
