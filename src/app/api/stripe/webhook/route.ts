import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { stripe } from "~/lib/stripe";

export const dynamic = "force-dynamic";

function planFromPriceId(priceId: string): string {
  if (priceId === env.STRIPE_SOLO_PRICE_ID) return "solo";
  if (priceId === env.STRIPE_TEAM_PRICE_ID) return "team";
  return "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId) break;

      // Get the subscription to find the price ID
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id ?? "";

      await db.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: planFromPriceId(priceId),
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price.id ?? "";

      const user = await db.user.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });

      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: {
            plan: planFromPriceId(priceId),
            stripeSubscriptionId: subscription.id,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await db.user.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });

      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
