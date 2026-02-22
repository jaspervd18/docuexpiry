import Link from "next/link";
import { format } from "date-fns";

import { AppShellWithSidebar } from "~/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { DocumentStatusBadge } from "~/components/document-status-badge";
import { ExpiryTimelineChart } from "~/components/dashboard/expiry-timeline-chart";
import { ReminderActivity } from "~/components/dashboard/reminder-activity";

import { auth } from "~/server/auth";
import { getDocumentLimit } from "~/lib/plans";
import { api, HydrateClient } from "~/trpc/server";

function KpiCard({
  title,
  value,
  hint,
  accent,
  bar,
}: {
  title: string;
  value: string;
  hint?: string;
  accent?: "red" | "green";
  bar?: { current: number; max: number };
}) {
  return (
    <Card className="group cursor-default border-border/60 bg-card/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary ${
            accent === "red"
              ? "text-destructive"
              : accent === "green"
                ? "text-emerald-600 dark:text-emerald-400"
                : ""
          }`}
        >
          {value}
        </div>
        {bar ? (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.min((bar.current / bar.max) * 100, 100)}%`,
              }}
            />
          </div>
        ) : null}
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const plan = session?.user?.plan ?? "free";
  const docLimit = getDocumentLimit(plan);

  const [summary, expiringSoon, expiryTimeline, reminderActivity] =
    await Promise.all([
      api.dashboard.summary(),
      api.dashboard.expiringSoon(),
      api.dashboard.expiryTimeline(),
      plan !== "free"
        ? api.dashboard.reminderActivity()
        : Promise.resolve(null),
    ]);

  return (
    <HydrateClient>
      <AppShellWithSidebar>
        <div className="space-y-6">
          <header className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                Overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Your expirations overview.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/documents/new">Add document</Link>
            </Button>
          </header>

          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total documents"
              value={`${summary.totalDocuments} / ${docLimit}`}
              bar={{ current: summary.totalDocuments, max: docLimit }}
              hint={
                summary.totalDocuments === 0
                  ? "Add your first document to get started."
                  : undefined
              }
            />
            <KpiCard
              title="Expiring soon (30d)"
              value={String(summary.expiringSoonDocuments)}
            />
            <KpiCard
              title="Expired"
              value={String(summary.expiredDocuments)}
              accent="red"
            />
            <KpiCard
              title="Valid"
              value={String(summary.validDocuments)}
              accent="green"
            />
          </div>

          {/* Main content: chart + expiring list */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60 bg-card/80 shadow-sm">
              <CardHeader>
                <CardTitle>Expiry timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpiryTimelineChart data={expiryTimeline} />
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expiring soon</CardTitle>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/documents">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {expiringSoon.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">
                      No documents expiring soon
                    </div>
                    <div className="mt-1">
                      Documents approaching their expiry date will appear here.
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-background/40">
                    {expiringSoon.map((d) => (
                      <Link
                        key={d.id}
                        href={`/documents/${d.id}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-primary/5"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.category?.name ?? "—"}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden text-sm text-muted-foreground sm:block">
                            {format(new Date(d.expiresAt), "PP")}
                          </div>
                          <DocumentStatusBadge
                            expiresAt={new Date(d.expiresAt)}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reminder activity */}
          <Card className="border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Reminder activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ReminderActivity reminders={reminderActivity} plan={plan} />
            </CardContent>
          </Card>
        </div>
      </AppShellWithSidebar>
    </HydrateClient>
  );
}
