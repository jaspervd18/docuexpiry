import { AppShellWithSidebar } from "~/components/app-shell";
import { NotificationSettingsForm } from "~/components/notification-settings-form";
import { api, HydrateClient } from "~/trpc/server";

export default async function NotificationSettingsPage() {
  void api.notification.getSettings.prefetch();

  return (
    <HydrateClient>
      <AppShellWithSidebar>
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Notification Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure how and when you receive reminders about expiring
              documents.
            </p>
          </header>

          <NotificationSettingsForm />
        </div>
      </AppShellWithSidebar>
    </HydrateClient>
  );
}
