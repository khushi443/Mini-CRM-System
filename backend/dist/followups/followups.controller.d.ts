import { FollowupsService } from './followups.service';
import { CreateFollowupDto } from './create-followup.dto';
export declare class FollowupsController {
    private service;
    constructor(service: FollowupsService);
    getAll(req: any): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }[]>;
    getUpcoming(req: any): Promise<({
        lead: {
            name: string;
            email: string;
            createdAt: Date;
            id: number;
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
    getByLead(leadId: string, req: any): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }[]>;
    create(body: CreateFollowupDto, req: any): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }>;
    complete(id: string, req: any): Promise<{
        id: number;
        status: string;
        leadId: number;
        date: Date;
        remark: string | null;
    }>;
}
