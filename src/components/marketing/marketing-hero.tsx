"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Check, Clock, ShieldCheck } from "lucide-react";

import { Reveal, RevealStagger } from "./reveal";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function MarketingHero(props: { signInHref: string }) {
  const { signInHref } = props;

  return (
    <section className="relative overflow-hidden">
      {/* pastel blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-[-120px] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Track expirations. Prevent surprises.
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Never miss a document expiration again.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                DocuExpiry keeps your certificates, licenses, contracts, and
                compliance docs organized—then nudges you before they expire.
                Built for solo operators and small teams.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="group shadow-sm hover:shadow-md">
                  <Link href={signInHref} className="relative">
                    <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <a href="#pricing">See pricing</a>
                </Button>

                <div className="text-xs text-muted-foreground sm:ml-2">
                  No credit card • Google sign-in
                </div>
              </div>
            </Reveal>

            <RevealStagger className="grid gap-3 sm:grid-cols-3">
              <Reveal>
                <MiniStat
                  icon={<Clock className="h-4 w-4" />}
                  title="2 min setup"
                  desc="Add a doc + date."
                />
              </Reveal>
              <Reveal>
                <MiniStat
                  icon={<BellRing className="h-4 w-4" />}
                  title="Smart reminders"
                  desc="Before expiry."
                />
              </Reveal>
              <Reveal>
                <MiniStat
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Private by default"
                  desc="Per-user data."
                />
              </Reveal>
            </RevealStagger>
          </div>

          <Reveal delay={0.08} className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-xl" />
            <Card className="relative overflow-hidden rounded-3xl border bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Expirations overview
                  <Badge variant="outline">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DemoRow
                  name="Insurance certificate"
                  meta="Vehicle"
                  badge="12d left"
                  tone="warn"
                />
                <DemoRow
                  name="Safety inspection"
                  meta="Compliance"
                  badge="Valid"
                  tone="ok"
                />
                <DemoRow
                  name="ISO audit report"
                  meta="Compliance"
                  badge="Expired"
                  tone="bad"
                />
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next reminder</span>
                  <span className="font-medium">In 3 days</span>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MiniStat(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-primary">{props.icon}</span>
        {props.title}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}

function DemoRow(props: {
  name: string;
  meta: string;
  badge: string;
  tone: "warn" | "ok" | "bad";
}) {
  const badgeClass =
    props.tone === "bad"
      ? "bg-destructive text-destructive-foreground"
      : props.tone === "warn"
        ? "bg-primary/20 text-foreground"
        : "bg-muted text-foreground";

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background/70 p-3 transition-all duration-200 hover:shadow-md">
      <div>
        <div className="text-sm font-medium">{props.name}</div>
        <div className="text-xs text-muted-foreground">{props.meta}</div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs ${badgeClass}`}>
        {props.badge}
      </span>
    </div>
  );
}
