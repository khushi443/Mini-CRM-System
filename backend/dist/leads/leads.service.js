"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsService = class LeadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllLeads(userId, status) {
        return this.prisma.lead.findMany({
            where: {
                userId: Number(userId),
                ...(status && { status }),
            },
            orderBy: { id: 'desc' },
        });
    }
    async getLeadById(id, userId) {
        const lead = await this.prisma.lead.findFirst({
            where: {
                id: Number(id),
                userId: Number(userId),
            },
        });
        if (!lead) {
            throw new common_1.NotFoundException('Lead not found');
        }
        return lead;
    }
    async createLead(userId, data) {
        return this.prisma.lead.create({
            data: {
                ...data,
                userId: Number(userId),
            },
        });
    }
    async updateLead(id, userId, data) {
        const existing = await this.prisma.lead.findFirst({
            where: {
                id: Number(id),
                userId: Number(userId),
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Lead not found or not yours');
        }
        return this.prisma.lead.update({
            where: { id: Number(id) },
            data,
        });
    }
    async deleteLead(id, userId) {
        const existing = await this.prisma.lead.findFirst({
            where: {
                id: Number(id),
                userId: Number(userId),
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Lead not found or not yours');
        }
        await this.prisma.lead.delete({
            where: { id: Number(id) },
        });
        return { message: 'Lead deleted successfully' };
    }
    async getAllLeadsForAdmin() {
        return this.prisma.lead.findMany({
            orderBy: { id: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map