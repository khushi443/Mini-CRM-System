import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FollowupsService } from './followups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('followups')
@UseGuards(JwtAuthGuard) // 🔥 IMPORTANT
export class FollowupsController {
  constructor(private service: FollowupsService) {}

  // 🔥 GET ALL
  @Get()
  getAll() {
    return this.service.getAll();
  }

  // 🔥 FIXED UPCOMING
  @Get('upcoming')
  getUpcoming(@Req() req) {
    return this.service.getUpcoming(req.user.userId); // ✅ PASS USER ID
  }

  // 🔥 GET BY LEAD
  @Get(':leadId')
  getByLead(@Param('leadId') leadId: string) {
    return this.service.getByLead(Number(leadId));
  }

  // 🔥 CREATE
  @Post()
  create(@Body() body: any) {
    return this.service.create(
      body.leadId,
      body.date,
      body.remark
    );
  }
}