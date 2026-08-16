import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Rule-based "AI Insights" engine.
 *
 * This is intentionally NOT a call to an external LLM — no API key is
 * configured for this project. Every number and every lead/task named
 * below is pulled live from this user's own data via Prisma. If a metric
 * can't be computed from the current schema (e.g. deal value — Lead has
 * no value/amount field), we say so explicitly instead of inventing one.
 */
@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async ask(userId: number, question: string) {
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

    // Fallback: general summary so the user always gets a real answer.
    return this.pipelineSummary(leads, tasks);
  }

  private followUpInsight(leads: any[], followups: any[]) {
    const now = new Date();
    const leadIdsWithFollowup = new Set(followups.map((f) => f.leadId));
    const neverFollowedUp = leads.filter((l) => !leadIdsWithFollowup.has(l.id));
    const overdue = followups.filter(
      (f) => f.status === 'PENDING' && new Date(f.date) < now,
    );

    const lines: string[] = [];
    if (overdue.length) {
      lines.push(
        `${overdue.length} follow-up(s) are overdue: ` +
          overdue
            .slice(0, 5)
            .map((f) => `${f.lead?.name ?? 'lead #' + f.leadId} (was due ${new Date(f.date).toLocaleDateString()})`)
            .join(', '),
      );
    }
    if (neverFollowedUp.length) {
      lines.push(
        `${neverFollowedUp.length} lead(s) have no follow-up scheduled yet: ` +
          neverFollowedUp.slice(0, 5).map((l) => l.name).join(', '),
      );
    }
    if (!lines.length) {
      lines.push('All your leads have a follow-up on record and none are overdue.');
    }

    return { answer: lines.join(' '), basedOn: 'leads and follow-ups in your account' };
  }

  private valueInsight(leads: any[]) {
    const byStatus = this.countByStatus(leads);
    return {
      answer:
        `Deal value isn't tracked in the current data model yet, so I can't rank leads by revenue. ` +
        `As a proxy based on pipeline stage: you have ${byStatus.QUALIFIED ?? 0} QUALIFIED lead(s), ` +
        `which are typically the closest to a real opportunity. Add a value/amount field to the Lead model ` +
        `if you want this ranked by actual deal size.`,
      basedOn: 'lead status distribution',
    };
  }

  private priorityInsight(tasks: any[], followups: any[]) {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const overdueTasks = tasks.filter(
      (t) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < now,
    );
    const dueTodayTasks = tasks.filter(
      (t) =>
        t.status !== 'COMPLETED' &&
        t.dueDate &&
        new Date(t.dueDate) >= now &&
        new Date(t.dueDate) <= endOfToday,
    );
    const overdueFollowups = followups.filter(
      (f) => f.status === 'PENDING' && new Date(f.date) < now,
    );

    const lines: string[] = [];
    if (overdueTasks.length) lines.push(`${overdueTasks.length} task(s) are overdue.`);
    if (dueTodayTasks.length) lines.push(`${dueTodayTasks.length} task(s) are due today.`);
    if (overdueFollowups.length) lines.push(`${overdueFollowups.length} follow-up(s) are overdue.`);
    if (!lines.length) lines.push("Nothing is overdue or due today — you're caught up.");

    return { answer: lines.join(' '), basedOn: 'tasks and follow-ups in your account' };
  }

  private pipelineSummary(leads: any[], tasks: any[]) {
    const leadsByStatus = this.countByStatus(leads);
    const tasksByStatus = this.countByStatus(tasks);

    const leadSummary = Object.entries(leadsByStatus)
      .map(([status, count]) => `${count} ${status}`)
      .join(', ');
    const taskSummary = Object.entries(tasksByStatus)
      .map(([status, count]) => `${count} ${status}`)
      .join(', ');

    return {
      answer:
        `You have ${leads.length} lead(s) total (${leadSummary || 'none yet'}). ` +
        `Tasks: ${tasks.length} total (${taskSummary || 'none yet'}).`,
      basedOn: 'all leads and tasks in your account',
    };
  }

  private countByStatus(items: { status: string }[]) {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
  }
}
