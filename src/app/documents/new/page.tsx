import { AppShell } from "~/components/app-shell";
import { NewDocumentForm } from "~/components/new-document-form";

export default async function NewDocumentPage() {
  return (
    <AppShell>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Add document</h1>
        <p className="text-sm text-muted-foreground">
          Only a name and expiry date are required.
        </p>
      </div>

      <div className="mt-6">
        <NewDocumentForm />
      </div>
    </AppShell>
  );
}
