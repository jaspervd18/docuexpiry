import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

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
