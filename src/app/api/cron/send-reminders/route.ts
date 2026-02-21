import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { resend } from "~/server/email";
import { ReminderEmail } from "~/server/emails/reminder-email";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let totalSent = 0;
  const errors: string[] = [];

  // Find all users who should receive email reminders:
  // - must have an email
  // - either no NotificationSettings row (defaults apply) or emailEnabled = true
  const users = await db.user.findMany({
    where: {
      email: { not: null },
      OR: [
        { notificationSettings: null },
        { notificationSettings: { emailEnabled: true } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      notificationSettings: { select: { reminderDays: true } },
    },
  });

  for (const user of users) {
    if (!user.email) continue;

    const reminderDays =
      user.notificationSettings?.reminderDays ?? [30, 7, 1];

    for (const days of reminderDays) {
      // Calculate the target date range (full day) for documents expiring in `days` days
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Find documents expiring on that day that haven't been reminded yet
      const documents = await db.document.findMany({
        where: {
          userId: user.id,
          expiresAt: { gte: startOfDay, lte: endOfDay },
          reminderLogs: {
            none: { daysBeforeExpiry: days },
          },
        },
        select: { id: true, name: true, expiresAt: true },
      });

      for (const doc of documents) {
        try {
          await resend.emails.send({
            from: "DocuExpiry <reminders@docuexpiry.com>",
            to: user.email,
            subject: `${doc.name} expires in ${days} day${days === 1 ? "" : "s"}`,
            react: ReminderEmail({
              userName: user.name ?? "there",
              documentName: doc.name,
              daysUntilExpiry: days,
              expiresAt: doc.expiresAt,
              dashboardUrl: "https://docuexpiry.com/dashboard",
            }),
          });

          await db.reminderLog.create({
            data: {
              documentId: doc.id,
              userId: user.id,
              daysBeforeExpiry: days,
            },
          });

          totalSent++;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(`doc=${doc.id} user=${user.id}: ${message}`);
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent: totalSent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
