"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "./reveal";
import { Button } from "~/components/ui/button";

export function MarketingCtaFooter(props: { signInHref: string }) {
  const year = new Date().getFullYear();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-card/80 p-8 shadow-sm backdrop-blur sm:p-10">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-[-80px] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-border/20" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">
                Ready to stop chasing expirations?
              </h3>
              <p className="text-muted-foreground">
                Start free and add your first document in under 2 minutes.
              </p>
            </div>

            <Button asChild size="lg" className="group shadow-sm hover:shadow-md">
              <Link href={props.signInHref} className="relative">
                <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                Start free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>

      <footer className="mt-12 pt-8">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} DocuExpiry</div>
          <div className="flex gap-4">
            <a className="hover:text-foreground transition-colors" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-foreground transition-colors" href="#features">
              Features
            </a>
            <a className="hover:text-foreground transition-colors" href="#faq">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
