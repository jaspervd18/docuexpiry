"use client";

import { Check } from "lucide-react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const TIERS = [
  {
    id: "free" as const,
    name: "Free",
    price: "\u20ac0",
    subtitle: "For trying it out",
    highlights: ["Up to 10 documents", "Categories + tags", "Email reminders"],
  },
  {
    id: "solo" as const,
    name: "Solo",
    price: "\u20ac5",
    subtitle: "For one-person businesses",
    highlights: [
      "Up to 200 documents",
      "Custom reminder schedule",
      "CSV import (coming soon)",
    ],
    featured: true,
  },
  {
    id: "team" as const,
    name: "Team",
    price: "\u20ac12",
    subtitle: "For small teams",
    highlights: [
      "Up to 2,000 documents",
      "Shared workspace (coming soon)",
      "Roles + access control (soon)",
    ],
  },
];

export function BillingContent() {
  const { data, isLoading } = api.subscription.getStatus.useQuery();

  const checkoutMutation = api.subscription.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const portalMutation = api.subscription.createPortalSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Loading billing info...
        </CardContent>
      </Card>
    );
  }

  const currentPlan = data.plan;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>
            You are on the <strong>{data.planName}</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {data.documentCount} / {data.documentLimit} documents used
            </div>
            {currentPlan !== "free" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                {portalMutation.isPending ? "Loading..." : "Manage billing"}
              </Button>
            )}
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.min(100, (data.documentCount / data.documentLimit) * 100)}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isCurrent = currentPlan === tier.id;
          const isUpgrade =
            tier.id !== "free" &&
            ((currentPlan === "free") ||
              (currentPlan === "solo" && tier.id === "team"));

          return (
            <Card
              key={tier.id}
              className={[
                "rounded-3xl transition-all duration-200",
                tier.featured ? "border-primary/40 shadow-md" : "",
                isCurrent ? "ring-2 ring-primary" : "",
              ].join(" ")}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  {isCurrent && (
                    <Badge className="bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  )}
                  {tier.featured && !isCurrent && (
                    <Badge className="bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  )}
                </div>
                <div className="text-4xl font-semibold tracking-tight">
                  {tier.price}
                  <span className="text-base font-normal text-muted-foreground">
                    /mo
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tier.subtitle}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current plan
                  </Button>
                ) : isUpgrade ? (
                  <Button
                    className="w-full"
                    variant={tier.featured ? "default" : "outline"}
                    onClick={() =>
                      checkoutMutation.mutate({
                        planId: tier.id,
                      })
                    }
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending
                      ? "Loading..."
                      : `Upgrade to ${tier.name}`}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    {tier.id === "free" ? "Included" : tier.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
