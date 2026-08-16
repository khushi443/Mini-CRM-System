import { AiService } from './ai.service';
import { AskDto } from './ask.dto';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    ask(body: AskDto, req: any): Promise<{
        answer: string;
        basedOn: string;
    }>;
}
