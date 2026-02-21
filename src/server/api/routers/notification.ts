import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const settings = await ctx.db.notificationSettings.findUnique({
      where: { userId },
    });

    return {
      emailEnabled: settings?.emailEnabled ?? true,
      reminderDays: settings?.reminderDays ?? [30, 7, 1],
    };
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        emailEnabled: z.boolean(),
        reminderDays: z
          .array(z.number().int().min(1).max(365))
          .min(1)
          .max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.notificationSettings.upsert({
        where: { userId },
        update: {
          emailEnabled: input.emailEnabled,
          reminderDays: input.reminderDays,
        },
        create: {
          userId,
          emailEnabled: input.emailEnabled,
          reminderDays: input.reminderDays,
        },
      });
    }),
});
