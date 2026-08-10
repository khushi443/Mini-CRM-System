import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // 🔥 ADD THIS
@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(leadId: number, content: string) {
    return this.prisma.note.create({
      data: { content, leadId },
    });
  }

  getByLead(leadId: number) {
    return this.prisma.note.findMany({
      where: { leadId },
      orderBy: { id: 'desc' },
    });
  }
}