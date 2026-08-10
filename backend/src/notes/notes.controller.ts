import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotesService } from './notes.service'; // 🔥 ADD THIS

@Controller('notes')
export class NotesController {
  constructor(private service: NotesService) {}

  @Post()
  create(@Body() body) {
    return this.service.create(body.leadId, body.content);
  }

  @Get(':leadId')
  get(@Param('leadId') id: string) {
    return this.service.getByLead(Number(id));
  }
}