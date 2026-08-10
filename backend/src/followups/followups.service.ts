import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowupsService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: number, date: string, remark: string) {
    return this.prisma.followUp.create({
      data: {
        leadId: Number(leadId),
        date: new Date(date),
        remark,
      },
    });
  }

  async getByLead(leadId: number) {
    return this.prisma.followUp.findMany({
      where: {
        leadId: Number(leadId),
      },
      orderBy: { date: 'asc' },
    });
  }

  async getAll() {
    return this.prisma.followUp.findMany({
      orderBy: { date: 'asc' },
    });
  }

  // 🔥 FINAL (NO relation, NO userId)
  async getUpcoming(userId: number) {
  return this.prisma.followUp.findMany({
    where: {
      lead: {
        userId: userId
      },
      date: {
        gte: new Date()
      }
    },
    include: {
      lead: {
        include: {
          user: true   // 🔥 ADD THIS
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  });
}
}