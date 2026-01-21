"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useActiveSection } from "./use-active-session";

type NavItem = { id: "features" | "pricing" | "faq"; label: string };

const NAV: NavItem[] = [
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MarketingNav(props: { signInHref: string }) {
  const active = useActiveSection(NAV.map((n) => n.id));

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md transition-shadow",
        scrolled && "shadow-sm",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <span>DocuExpiry</span>
          <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
            Beta
          </Badge>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                active === item.id && "bg-primary/10 text-foreground",
              )}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(item.id);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={props.signInHref}>Sign in</Link>
          </Button>

          <Button asChild className="group shadow-sm hover:shadow-md">
            <Link href={props.signInHref} className="relative">
              <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
