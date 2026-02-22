import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { DashboardShell } from "./dashboard-shell";
import { getDocumentLimit } from "~/lib/plans";
import { db } from "~/server/db";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <SiteHeader user={session.user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}

export async function AppShellWithSidebar({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const plan = session.user.plan ?? "free";
  const documentCount = await db.document.count({
    where: { userId: session.user.id },
  });
  const documentLimit = getDocumentLimit(plan);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <SiteHeader user={session.user} />
      <DashboardShell
        plan={plan}
        documentCount={documentCount}
        documentLimit={documentLimit}
      >
        {children}
      </DashboardShell>
      <SiteFooter />
    </div>
  );
}
