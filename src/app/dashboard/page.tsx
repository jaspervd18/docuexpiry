import { AppShell } from "~/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
    <Card className="hover:shadow-lg cursor-default group border-border hover:border-primary-200 transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-200">{value}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground transition-colors duration-200">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your expirations overview (documents coming next).
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total documents" value="0" hint="Add your first document to get started." />
          <KpiCard title="Expiring soon (30d)" value="0" />
          <KpiCard title="Expired" value="0" />
          <KpiCard title="Next reminder" value="—" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover:shadow-lg border-border hover:border-primary-200 group">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="group-hover:text-primary transition-colors duration-200">Expiring soon</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">No documents expiring soon 🎉</div>
              <div className="mt-1 transition-colors duration-200">
                Once you add documents with expiry dates, they&apos;ll appear here.
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg border-border hover:border-primary-200 group">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors duration-200">Recently added</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground transition-colors duration-200">
              Nothing yet. Your latest documents will show up here.
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
