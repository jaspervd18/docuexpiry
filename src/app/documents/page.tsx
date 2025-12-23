import { AppShell } from "~/components/app-shell";
import { DocumentsTable } from "~/components/documents-table";

export default async function DocumentsPage() {
  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Add documents and track their expiration dates.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DocumentsTable />
      </div>
    </AppShell>
  );
}
