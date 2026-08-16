import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowupsService {
  constructor(private prisma: PrismaService) {}

  private async assertLeadOwnership(userId: number, leadId: number) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.userId !== userId) throw new ForbiddenException('Not your lead');
    return lead;
  }

  async create(userId: number, leadId: number, date: string, remark?: string) {
    await this.assertLeadOwnership(userId, leadId);
    return this.prisma.followUp.create({
      data: {
        leadId: Number(leadId),
        date: new Date(date),
        remark,
      },
    });
  }

  async getByLead(userId: number, leadId: number) {
    await this.assertLeadOwnership(userId, leadId);
    return this.prisma.followUp.findMany({
      where: { leadId },
      orderBy: { date: 'asc' },
    });
  }

  async getAllForUser(userId: number) {
    return this.prisma.followUp.findMany({
      where: { lead: { userId } },
      orderBy: { date: 'asc' },
    });
  }

  async markCompleted(userId: number, id: number) {
    const followUp = await this.prisma.followUp.findUnique({ where: { id } });
    if (!followUp) throw new NotFoundException('Follow-up not found');
    await this.assertLeadOwnership(userId, followUp.leadId);
    return this.prisma.followUp.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async getUpcoming(userId: number) {
    return this.prisma.followUp.findMany({
      where: {
        lead: { userId },
        date: { gte: new Date() },
      },
      include: { lead: true },
      orderBy: { date: 'asc' },
    });
  }
}
