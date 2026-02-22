import { format } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const now = new Date();
    const in30 = new Date(now);
    in30.setDate(in30.getDate() + 30);

    const [
      totalDocuments,
      expiredDocuments,
      expiringSoonDocuments,
      validDocuments,
      nextExpiring,
    ] = await Promise.all([
      ctx.db.document.count({ where: { userId } }),
      ctx.db.document.count({ where: { userId, expiresAt: { lt: now } } }),
      ctx.db.document.count({
        where: { userId, expiresAt: { gte: now, lte: in30 } },
      }),
      ctx.db.document.count({
        where: { userId, expiresAt: { gt: in30 } },
      }),
      ctx.db.document.findFirst({
        where: { userId, expiresAt: { gte: now } },
        orderBy: { expiresAt: "asc" },
        select: { expiresAt: true },
      }),
    ]);

    return {
      totalDocuments,
      expiredDocuments,
      expiringSoonDocuments,
      validDocuments,
      nextExpiringAt: nextExpiring?.expiresAt ?? null,
    };
  }),

  expiringSoon: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const now = new Date();
    const in30 = new Date(now);
    in30.setDate(in30.getDate() + 30);

    return ctx.db.document.findMany({
      where: { userId, expiresAt: { gte: now, lte: in30 } },
      orderBy: { expiresAt: "asc" },
      take: 5,
      select: {
        id: true,
        name: true,
        expiresAt: true,
        category: { select: { name: true } },
      },
    });
  }),

  recentlyAdded: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiresAt: true,
        category: { select: { name: true } },
      },
    });
  }),

  expiryTimeline: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const now = new Date();
    const in12Months = new Date(now);
    in12Months.setMonth(in12Months.getMonth() + 12);

    const documents = await ctx.db.document.findMany({
      where: {
        userId,
        expiresAt: { gte: now, lte: in12Months },
      },
      select: { expiresAt: true },
    });

    // Build all 12 months, then fill in counts
    const months: { month: string; count: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({ month: format(d, "MMM yyyy"), count: 0 });
    }

    for (const doc of documents) {
      const key = format(new Date(doc.expiresAt), "MMM yyyy");
      const entry = months.find((m) => m.month === key);
      if (entry) entry.count++;
    }

    return months;
  }),

  reminderActivity: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.reminderLog.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      take: 10,
      select: {
        id: true,
        sentAt: true,
        daysBeforeExpiry: true,
        document: { select: { id: true, name: true } },
      },
    });
  }),
});
