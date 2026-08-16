import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AskDto } from './ask.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('ask')
  ask(@Body() body: AskDto, @Req() req) {
    return this.aiService.ask(req.user.userId, body.question);
  }
}
