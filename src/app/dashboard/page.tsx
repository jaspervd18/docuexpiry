import Link from "next/link";
import { format } from "date-fns";

import { AppShell } from "~/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { DocumentStatusBadge } from "~/components/document-status-badge";

import { api, HydrateClient } from "~/trpc/server";

function KpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="group cursor-default border-border/60 bg-card/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {value}
        </div>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  // Server-side fetching (fast, no client state needed)
  const [summary, expiringSoon, recentlyAdded] = await Promise.all([
    api.dashboard.summary(),
    api.dashboard.expiringSoon(),
    api.dashboard.recentlyAdded(),
  ]);

  const nextReminder =
    summary.nextExpiringAt ? format(new Date(summary.nextExpiringAt), "PP") : "—";

  return (
    <HydrateClient>
      <AppShell>
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Your expirations overview.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total documents"
              value={String(summary.totalDocuments)}
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
            <KpiCard title="Expired" value={String(summary.expiredDocuments)} />
            <KpiCard title="Next reminder" value={nextReminder} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="group lg:col-span-2 border-border/60 bg-card/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="transition-colors group-hover:text-primary">
                  Expiring soon
                </CardTitle>

                <Button asChild variant="secondary" size="sm">
                  <Link href="/documents">View all</Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {expiringSoon.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">
                      No documents expiring soon 🎉
                    </div>
                    <div className="mt-1">
                      Once you add documents with expiry dates, they’ll appear
                      here.
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

            <Card className="group border-border/60 bg-card/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="transition-colors group-hover:text-primary">
                  Recently added
                </CardTitle>

                <Button asChild variant="secondary" size="sm">
                  <Link href="/documents/new">Add</Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {recentlyAdded.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nothing yet. Your latest documents will show up here.
                  </div>
                ) : (
                  <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-background/40">
                    {recentlyAdded.map((d) => (
                      <Link
                        key={d.id}
                        href={`/documents/${d.id}`}
                        className="block px-4 py-3 transition-colors hover:bg-primary/5"
                      >
                        <div className="truncate font-medium">{d.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Added {format(new Date(d.createdAt), "PP")}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    </HydrateClient>
  );
}
