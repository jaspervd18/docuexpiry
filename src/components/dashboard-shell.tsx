"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings/notifications", icon: Settings },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/documents") return pathname.startsWith("/documents");
  return pathname.startsWith(href);
}

export function DashboardShell({
  children,
  plan,
  documentCount,
  documentLimit,
}: {
  children: React.ReactNode;
  plan: string;
  documentCount: number;
  documentLimit: number;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const planName = plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Free";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-14 z-30 flex h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-border/40 bg-sidebar transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan card */}
        <div className="border-t border-border/40 px-4 py-4">
          <div className="rounded-md bg-muted/50 px-3 py-2.5 text-xs">
            <span className="font-medium">{planName}</span>
            <span className="text-muted-foreground">
              {" "}— {documentCount}/{documentLimit} docs
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile hamburger */}
        <div className="sticky top-14 z-20 flex h-12 items-center border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
