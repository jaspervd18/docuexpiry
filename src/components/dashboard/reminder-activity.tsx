"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Bell } from "lucide-react";
import { UpgradePrompt } from "./upgrade-prompt";

type ReminderEntry = {
  id: string;
  sentAt: Date;
  daysBeforeExpiry: number;
  document: { id: string; name: string };
};

export function ReminderActivity({
  reminders,
  plan,
}: {
  reminders: ReminderEntry[] | null;
  plan: string;
}) {
  if (plan === "free") {
    return <UpgradePrompt feature="reminder activity" plan="solo" />;
  }

  if (!reminders || reminders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
        <Bell className="h-5 w-5" />
        <p>No reminders sent yet.</p>
        <p className="text-xs">
          Reminders will appear here once documents approach their expiry dates.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-background/40">
      {reminders.map((r) => (
        <div
          key={r.id}
          className="flex items-start gap-3 px-4 py-3 text-sm"
        >
          <Bell className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p>
              Reminder sent for{" "}
              <Link
                href={`/documents/${r.document.id}`}
                className="font-medium hover:underline"
              >
                {r.document.name}
              </Link>{" "}
              <span className="text-muted-foreground">
                — {r.daysBeforeExpiry} day{r.daysBeforeExpiry !== 1 ? "s" : ""}{" "}
                before expiry
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {format(new Date(r.sentAt), "PP")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
