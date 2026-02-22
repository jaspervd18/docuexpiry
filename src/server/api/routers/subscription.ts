import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stripe } from "~/lib/stripe";
import { env } from "~/env";
import { getDocumentLimit, PLANS } from "~/lib/plans";

export const subscriptionRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const plan = ctx.session.user.plan ?? "free";
    const limit = getDocumentLimit(plan);
    const documentCount = await ctx.db.document.count({ where: { userId } });

    return {
      plan,
      planName: PLANS[plan as keyof typeof PLANS]?.name ?? "Free",
      documentCount,
      documentLimit: limit,
    };
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ planId: z.enum(["solo", "team"]) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.db.user.findUniqueOrThrow({
        where: { id: userId },
        select: { email: true, stripeCustomerId: true },
      });

      // Create or reuse Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: { userId },
        });
        customerId = customer.id;
        await ctx.db.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      const priceId =
        input.planId === "solo"
          ? env.STRIPE_SOLO_PRICE_ID
          : env.STRIPE_TEAM_PRICE_ID;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${env.AUTH_URL ?? "http://localhost:3000"}/dashboard/billing?success=true`,
        cancel_url: `${env.AUTH_URL ?? "http://localhost:3000"}/dashboard/billing?canceled=true`,
        metadata: { userId },
      });

      if (!session.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: session.url };
    }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No billing account found. Subscribe to a plan first.",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.AUTH_URL ?? "http://localhost:3000"}/dashboard/billing`,
    });

    return { url: session.url };
  }),
});
