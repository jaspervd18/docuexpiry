import { AppShell } from "~/components/app-shell";

export default async function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Coming next: add documents and track their expiration dates.
        </p>
      </div>
    </AppShell>
  );
}
