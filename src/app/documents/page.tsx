import { AppShellWithSidebar } from "~/components/app-shell";
import { DocumentsTable } from "~/components/documents-table";

export default async function DocumentsPage() {
  return (
    <AppShellWithSidebar flush>
      <DocumentsTable />
    </AppShellWithSidebar>
  );
}
