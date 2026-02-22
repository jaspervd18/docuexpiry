import { AppShellWithSidebar } from "~/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ExpiryTimelineChart } from "~/components/dashboard/expiry-timeline-chart";
import { ReminderActivity } from "~/components/dashboard/reminder-activity";
import { UpgradePrompt } from "~/components/dashboard/upgrade-prompt";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function AnalyticsPage() {
  const session = await auth();
  const plan = session?.user?.plan ?? "free";

  const [expiryTimeline, reminderActivity] = await Promise.all([
    api.dashboard.expiryTimeline(),
    plan !== "free"
      ? api.dashboard.reminderActivity()
      : Promise.resolve(null),
  ]);

  return (
    <HydrateClient>
      <AppShellWithSidebar>
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Insights into your document expirations and reminders.
            </p>
          </header>

          <Card className="border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Expiry timeline — next 12 months</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpiryTimelineChart data={expiryTimeline} />
            </CardContent>
          </Card>

          {plan === "free" ? (
            <UpgradePrompt feature="detailed analytics" plan="solo" />
          ) : (
            <Card className="border-border/60 bg-card/80 shadow-sm">
              <CardHeader>
                <CardTitle>Reminder history</CardTitle>
              </CardHeader>
              <CardContent>
                <ReminderActivity reminders={reminderActivity} plan={plan} />
              </CardContent>
            </Card>
          )}
        </div>
      </AppShellWithSidebar>
    </HydrateClient>
  );
}
