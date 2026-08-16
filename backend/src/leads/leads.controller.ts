import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateLeadDto } from './create-lead.dto';

@UseGuards(JwtAuthGuard) // 🔐 sab routes protected
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  // ================= USER ROUTES =================

  // ✅ GET ALL (user specific)
  @Get()
  getAllLeads(@Req() req, @Query('status') status?: string) {
    return this.leadsService.getAllLeads(req.user.userId, status);
  }

  // ================= ADMIN ROUTE =================
  // NOTE: must be declared before ':id' below, otherwise Nest matches
  // 'all' as an :id param and this route is never reached.

  // 🔥 ADMIN ONLY → ALL USERS DATA
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllLeadsAdmin() {
    return this.leadsService.getAllLeadsForAdmin();
  }

  // ✅ GET ONE
  @Get(':id')
  getLead(@Param('id') id: string, @Req() req) {
    return this.leadsService.getLeadById(Number(id), req.user.userId);
  }

  // ✅ CREATE
  @Post()
  createLead(@Body() body: CreateLeadDto, @Req() req) {
    return this.leadsService.createLead(req.user.userId, body);
  }

  // ✅ UPDATE
  @Put(':id')
  updateLead(
    @Param('id') id: string,
    @Body() body: Partial<CreateLeadDto>,
    @Req() req,
  ) {
    return this.leadsService.updateLead(
      Number(id),
      req.user.userId,
      body,
    );
  }

  // ✅ DELETE
  @Delete(':id')
  deleteLead(@Param('id') id: string, @Req() req) {
    return this.leadsService.deleteLead(Number(id), req.user.userId);
  }
}