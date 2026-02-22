"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export function UpgradePrompt({
  feature,
  plan = "solo",
}: {
  feature: string;
  plan?: "solo" | "team";
}) {
  const planName = plan === "solo" ? "Solo" : "Team";

  return (
    <Card className="border-dashed border-border/60 bg-muted/30">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            Upgrade to {planName} to unlock {feature}
          </p>
          <p className="text-xs text-muted-foreground">
            Get more out of DocuExpiry with a paid plan.
          </p>
        </div>
        <Button asChild size="sm" className="mt-1">
          <Link href="/dashboard/billing">Upgrade</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
