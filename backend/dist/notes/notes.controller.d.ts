import { NotesService } from './notes.service';
import { CreateNoteDto } from './create-note.dto';
export declare class NotesController {
    private service;
    constructor(service: NotesService);
    create(body: CreateNoteDto, req: any): Promise<{
        createdAt: Date;
        id: number;
        content: string;
        leadId: number;
    }>;
    get(id: string, req: any): Promise<{
        createdAt: Date;
        id: number;
        content: string;
        leadId: number;
    }[]>;
}
