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
exports.FollowupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FollowupsService = class FollowupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertLeadOwnership(userId, leadId) {
        const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        if (lead.userId !== userId)
            throw new common_1.ForbiddenException('Not your lead');
        return lead;
    }
    async create(userId, leadId, date, remark) {
        await this.assertLeadOwnership(userId, leadId);
        return this.prisma.followUp.create({
            data: {
                leadId: Number(leadId),
                date: new Date(date),
                remark,
            },
        });
    }
    async getByLead(userId, leadId) {
        await this.assertLeadOwnership(userId, leadId);
        return this.prisma.followUp.findMany({
            where: { leadId },
            orderBy: { date: 'asc' },
        });
    }
    async getAllForUser(userId) {
        return this.prisma.followUp.findMany({
            where: { lead: { userId } },
            orderBy: { date: 'asc' },
        });
    }
    async markCompleted(userId, id) {
        const followUp = await this.prisma.followUp.findUnique({ where: { id } });
        if (!followUp)
            throw new common_1.NotFoundException('Follow-up not found');
        await this.assertLeadOwnership(userId, followUp.leadId);
        return this.prisma.followUp.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
    async getUpcoming(userId) {
        return this.prisma.followUp.findMany({
            where: {
                lead: { userId },
                date: { gte: new Date() },
            },
            include: { lead: true },
            orderBy: { date: 'asc' },
        });
    }
};
exports.FollowupsService = FollowupsService;
exports.FollowupsService = FollowupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowupsService);
//# sourceMappingURL=followups.service.js.map