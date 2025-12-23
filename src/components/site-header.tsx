"use client";

import Link from "next/link";
import type { Session } from "next-auth";

import { Button } from "~/components/ui/button";
import { UserMenu } from "./user-menu";

export function SiteHeader({ user }: { user: Session["user"] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold tracking-tight text-lg hover:text-primary transition-colors duration-200 hover:scale-105 transform">
            DocuExpiry
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary-100 hover:text-primary transition-all duration-200">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary-100 hover:text-primary transition-all duration-200">
              <Link href="/documents">Documents</Link>
            </Button>
          </nav>
        </div>

        <UserMenu user={user} />
      </div>
    </header>
  );
}
