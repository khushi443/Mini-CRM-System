import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  private async assertLeadOwnership(userId: number, leadId: number) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.userId !== userId) throw new ForbiddenException('Not your lead');
    return lead;
  }

  async create(userId: number, leadId: number, content: string) {
    await this.assertLeadOwnership(userId, leadId);
    return this.prisma.note.create({
      data: { content, leadId },
    });
  }

  async getByLead(userId: number, leadId: number) {
    await this.assertLeadOwnership(userId, leadId);
    return this.prisma.note.findMany({
      where: { leadId },
      orderBy: { id: 'desc' },
    });
  }
}
