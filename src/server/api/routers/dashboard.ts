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
      nextExpiring,
    ] = await Promise.all([
      ctx.db.document.count({ where: { userId } }),
      ctx.db.document.count({ where: { userId, expiresAt: { lt: now } } }),
      ctx.db.document.count({
        where: { userId, expiresAt: { gte: now, lte: in30 } },
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
});
