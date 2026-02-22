"use client";

import { ArrowRight, BellRing, Check, Clock, ShieldCheck, Sparkles } from "lucide-react";

import { Reveal, RevealStagger } from "./reveal";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function MarketingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      <RevealStagger>
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Simple by design
            </h2>
            <p className="text-muted-foreground">
              Add a document in 30 seconds. Get reminded before it expires.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <FeatureCard
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="30-second setup"
              desc="Just a name, a category, and an expiry date."
            />
          </Reveal>
          <Reveal>
            <FeatureCard
              icon={<BellRing className="h-5 w-5 text-primary" />}
              title="Email reminders"
              desc="Get notified 30, 7, and 1 day before expiry. Automatically."
            />
          </Reveal>
          <Reveal>
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Private by default"
              desc="Your documents are scoped to your account. Multi-tenant ready when you are."
            />
          </Reveal>
          <Reveal>
            <FeatureCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Smart sorting"
              desc="Sort by expiry date, category, or name so urgent items rise to the top."
            />
          </Reveal>
          <Reveal>
            <FeatureCard
              icon={<Check className="h-5 w-5 text-primary" />}
              title="Clean workflow"
              desc="Dashboard → Documents → Add. No clutter."
            />
          </Reveal>
          <Reveal>
            <FeatureCard
              icon={<ArrowRight className="h-5 w-5 text-primary" />}
              title="Works for everything"
              desc="Passports, contracts, insurance, licences. If it expires, it belongs here."
            />
          </Reveal>
        </div>
      </RevealStagger>
    </section>
  );
}

function FeatureCard(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="group flex h-full flex-col rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-105">
          {props.icon}
        </div>
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">{props.desc}</CardContent>
    </Card>
  );
}
