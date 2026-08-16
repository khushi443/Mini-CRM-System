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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = class AiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ask(userId, question) {
        const q = question.toLowerCase();
        const [leads, tasks, followups] = await Promise.all([
            this.prisma.lead.findMany({ where: { userId } }),
            this.prisma.task.findMany({ where: { userId } }),
            this.prisma.followUp.findMany({
                where: { lead: { userId } },
                include: { lead: true },
            }),
        ]);
        if (q.includes('follow') && q.includes('up') || q.includes('followup')) {
            return this.followUpInsight(leads, followups);
        }
        if (q.includes('valuable') || q.includes('value')) {
            return this.valueInsight(leads);
        }
        if (q.includes('prioritiz') || q.includes('priorit') || q.includes('today')) {
            return this.priorityInsight(tasks, followups);
        }
        if (q.includes('summar') || q.includes('pipeline')) {
            return this.pipelineSummary(leads, tasks);
        }
        return this.pipelineSummary(leads, tasks);
    }
    followUpInsight(leads, followups) {
        const now = new Date();
        const leadIdsWithFollowup = new Set(followups.map((f) => f.leadId));
        const neverFollowedUp = leads.filter((l) => !leadIdsWithFollowup.has(l.id));
        const overdue = followups.filter((f) => f.status === 'PENDING' && new Date(f.date) < now);
        const lines = [];
        if (overdue.length) {
            lines.push(`${overdue.length} follow-up(s) are overdue: ` +
                overdue
                    .slice(0, 5)
                    .map((f) => `${f.lead?.name ?? 'lead #' + f.leadId} (was due ${new Date(f.date).toLocaleDateString()})`)
                    .join(', '));
        }
        if (neverFollowedUp.length) {
            lines.push(`${neverFollowedUp.length} lead(s) have no follow-up scheduled yet: ` +
                neverFollowedUp.slice(0, 5).map((l) => l.name).join(', '));
        }
        if (!lines.length) {
            lines.push('All your leads have a follow-up on record and none are overdue.');
        }
        return { answer: lines.join(' '), basedOn: 'leads and follow-ups in your account' };
    }
    valueInsight(leads) {
        const byStatus = this.countByStatus(leads);
        return {
            answer: `Deal value isn't tracked in the current data model yet, so I can't rank leads by revenue. ` +
                `As a proxy based on pipeline stage: you have ${byStatus.QUALIFIED ?? 0} QUALIFIED lead(s), ` +
                `which are typically the closest to a real opportunity. Add a value/amount field to the Lead model ` +
                `if you want this ranked by actual deal size.`,
            basedOn: 'lead status distribution',
        };
    }
    priorityInsight(tasks, followups) {
        const now = new Date();
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        const overdueTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < now);
        const dueTodayTasks = tasks.filter((t) => t.status !== 'COMPLETED' &&
            t.dueDate &&
            new Date(t.dueDate) >= now &&
            new Date(t.dueDate) <= endOfToday);
        const overdueFollowups = followups.filter((f) => f.status === 'PENDING' && new Date(f.date) < now);
        const lines = [];
        if (overdueTasks.length)
            lines.push(`${overdueTasks.length} task(s) are overdue.`);
        if (dueTodayTasks.length)
            lines.push(`${dueTodayTasks.length} task(s) are due today.`);
        if (overdueFollowups.length)
            lines.push(`${overdueFollowups.length} follow-up(s) are overdue.`);
        if (!lines.length)
            lines.push("Nothing is overdue or due today — you're caught up.");
        return { answer: lines.join(' '), basedOn: 'tasks and follow-ups in your account' };
    }
    pipelineSummary(leads, tasks) {
        const leadsByStatus = this.countByStatus(leads);
        const tasksByStatus = this.countByStatus(tasks);
        const leadSummary = Object.entries(leadsByStatus)
            .map(([status, count]) => `${count} ${status}`)
            .join(', ');
        const taskSummary = Object.entries(tasksByStatus)
            .map(([status, count]) => `${count} ${status}`)
            .join(', ');
        return {
            answer: `You have ${leads.length} lead(s) total (${leadSummary || 'none yet'}). ` +
                `Tasks: ${tasks.length} total (${taskSummary || 'none yet'}).`,
            basedOn: 'all leads and tasks in your account',
        };
    }
    countByStatus(items) {
        return items.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] ?? 0) + 1;
            return acc;
        }, {});
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map