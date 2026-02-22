import { AppShellWithSidebar } from "~/components/app-shell";
import { EditDocumentForm } from "~/components/edit-document-form";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void api.document.getById.prefetch({ id });
  void api.document.listCategories.prefetch();
  void api.document.listTags.prefetch();

  return (
    <HydrateClient>
      <AppShellWithSidebar>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Edit document
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the details below.
          </p>
        </div>

        <div className="mt-6">
          <EditDocumentForm documentId={id} />
        </div>
      </AppShellWithSidebar>
    </HydrateClient>
  );
}
