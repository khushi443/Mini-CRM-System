import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto } from './create-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private service: NotesService) {}

  @Post()
  create(@Body() body: CreateNoteDto, @Req() req) {
    return this.service.create(req.user.userId, body.leadId, body.content);
  }

  @Get(':leadId')
  get(@Param('leadId') id: string, @Req() req) {
    return this.service.getByLead(req.user.userId, Number(id));
  }
}
