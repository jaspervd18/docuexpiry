"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

const REMINDER_DAY_OPTIONS = [60, 30, 14, 7, 3, 1] as const;

function dayLabel(days: number) {
  if (days === 1) return "1 day before";
  return `${days} days before`;
}

export function NotificationSettingsForm() {
  const { data, isLoading } = api.notification.getSettings.useQuery();
  const utils = api.useUtils();

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState<number[]>([30, 7, 1]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setEmailEnabled(data.emailEnabled);
      setReminderDays(data.reminderDays);
    }
  }, [data]);

  const mutation = api.notification.updateSettings.useMutation({
    onSuccess: () => {
      void utils.notification.getSettings.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function toggleDay(day: number) {
    setReminderDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((d) => d !== day);
      }
      return [...prev, day].sort((a, b) => b - a);
    });
  }

  function handleSave() {
    mutation.mutate({ emailEnabled, reminderDays });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Loading settings...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Reminders</CardTitle>
          <CardDescription>
            Receive email notifications before your documents expire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-toggle" className="cursor-pointer">
              Enable email reminders
            </Label>
            <Switch
              id="email-toggle"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Schedule</CardTitle>
          <CardDescription>
            Choose when to receive reminders before a document expires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {REMINDER_DAY_OPTIONS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <Checkbox
                  id={`day-${day}`}
                  checked={reminderDays.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                  disabled={
                    reminderDays.includes(day) && reminderDays.length === 1
                  }
                />
                <Label htmlFor={`day-${day}`} className="cursor-pointer">
                  {dayLabel(day)}
                </Label>
              </div>
            ))}
          </div>

          {reminderDays.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              You&apos;ll be reminded{" "}
              {reminderDays
                .sort((a, b) => b - a)
                .map((d) => `${d} day${d === 1 ? "" : "s"}`)
                .join(", ")}{" "}
              before expiry.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save settings"}
        </Button>
        {saved && (
          <span className="text-sm text-muted-foreground">
            Settings saved.
          </span>
        )}
        {mutation.isError && (
          <span className="text-sm text-destructive">
            Failed to save. Please try again.
          </span>
        )}
      </div>
    </div>
  );
}
