import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FollowupsService } from './followups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFollowupDto } from './create-followup.dto';

@Controller('followups')
@UseGuards(JwtAuthGuard)
export class FollowupsController {
  constructor(private service: FollowupsService) {}

  // GET ALL (current user's follow-ups only)
  @Get()
  getAll(@Req() req) {
    return this.service.getAllForUser(req.user.userId);
  }

  // Must stay above ':leadId' so 'upcoming' isn't captured as a leadId.
  @Get('upcoming')
  getUpcoming(@Req() req) {
    return this.service.getUpcoming(req.user.userId);
  }

  @Get(':leadId')
  getByLead(@Param('leadId') leadId: string, @Req() req) {
    return this.service.getByLead(req.user.userId, Number(leadId));
  }

  @Post()
  create(@Body() body: CreateFollowupDto, @Req() req) {
    return this.service.create(req.user.userId, body.leadId, body.date, body.remark);
  }

  // Uses the existing FollowUp.status field (already in the schema, default PENDING).
  @Patch(':id/complete')
  complete(@Param('id') id: string, @Req() req) {
    return this.service.markCompleted(req.user.userId, Number(id));
  }
}
