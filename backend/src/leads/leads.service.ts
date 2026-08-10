import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  // ================= USER =================

  // ✅ GET ALL (USER SPECIFIC)
  async getAllLeads(userId: number, status?: string) {
    return this.prisma.lead.findMany({
      where: {
        userId: Number(userId), // 🔥 ensure number
        ...(status && { status }),
      },
      orderBy: { id: 'desc' },
    });
  }

  // ✅ GET SINGLE (FIXED)
  async getLeadById(id: number, userId: number) {
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: Number(id),          // 🔥 FIX
        userId: Number(userId),  // 🔥 FIX
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  // ✅ CREATE
  async createLead(userId: number, data: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...data,
        userId: Number(userId), // 🔥 ensure number
      },
    });
  }

  // ✅ UPDATE
  async updateLead(id: number, userId: number, data: Partial<CreateLeadDto>) {
    const existing = await this.prisma.lead.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });

    if (!existing) {
      throw new NotFoundException('Lead not found or not yours');
    }

    return this.prisma.lead.update({
      where: { id: Number(id) },
      data,
    });
  }

  // ✅ DELETE
  async deleteLead(id: number, userId: number) {
    const existing = await this.prisma.lead.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });

    if (!existing) {
      throw new NotFoundException('Lead not found or not yours');
    }

    await this.prisma.lead.delete({
      where: { id: Number(id) },
    });

    return { message: 'Lead deleted successfully' };
  }

  // ================= ADMIN =================

  // 🔥 ADMIN → ALL USERS DATA (SAFE)
  async getAllLeadsForAdmin() {
    return this.prisma.lead.findMany({
      orderBy: { id: 'desc' },
    });
  }
}