"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "./reveal";
import { Button } from "~/components/ui/button";

export function MarketingStoryCta(props: { signInHref: string }) {
  const year = new Date().getFullYear();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-card/80 p-8 shadow-sm backdrop-blur sm:p-12">
          {/* Background blobs */}
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-[-80px] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-border/20" />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Don&apos;t wait for the next surprise.
            </h3>
            <p className="max-w-md text-muted-foreground">
              Start tracking your documents for free. It takes 2 minutes, and
              you&apos;ll wonder why you didn&apos;t do it sooner.
            </p>

            <Button asChild size="lg" className="group shadow-sm hover:shadow-md">
              <Link href={props.signInHref} className="relative">
                <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                Start free, no credit card needed
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Free forever for up to 10 documents.
            </p>
          </div>
        </div>
      </Reveal>

      <footer className="mt-12 pt-8">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; {year} DocuExpiry</div>
          <div className="flex gap-4">
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <a
              className="transition-colors hover:text-foreground"
              href="#features"
            >
              Features
            </a>
            <Link
              href={props.signInHref}
              className="transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
