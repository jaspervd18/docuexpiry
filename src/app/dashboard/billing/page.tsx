import { AppShell } from "~/components/app-shell";
import { BillingContent } from "~/components/billing-content";
import { api, HydrateClient } from "~/trpc/server";

export default async function BillingPage() {
  void api.subscription.getStatus.prefetch();

  return (
    <HydrateClient>
      <AppShell>
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
            <p className="text-sm text-muted-foreground">
              Manage your plan and subscription.
            </p>
          </header>

          <BillingContent />
        </div>
      </AppShell>
    </HydrateClient>
  );
}
