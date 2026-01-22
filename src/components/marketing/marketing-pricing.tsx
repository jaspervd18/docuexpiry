"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { Reveal, RevealStagger } from "./reveal";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function MarketingPricing(props: { signInHref: string }) {
  const { signInHref } = props;

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      <RevealStagger>
        <Reveal className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple pricing
          </h2>
          <p className="text-muted-foreground">
            Start free, upgrade when it saves you time.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal>
            <PricingCard
              title="Free"
              price="€0"
              subtitle="For trying it out"
              highlights={[
                "Up to 10 documents",
                "Categories + tags",
                "Dashboard + table view",
              ]}
              cta="Start free"
              href={signInHref}
              variant="outline"
            />
          </Reveal>

          <Reveal>
            <PricingCard
              title="Solo"
              price="€5"
              subtitle="For one-person businesses"
              highlights={[
                "Up to 200 documents",
                "Expiring soon alerts",
                "Priority roadmap voting",
              ]}
              cta="Go Solo"
              href={signInHref}
              featured
            />
          </Reveal>

          <Reveal>
            <PricingCard
              title="Team"
              price="€12"
              subtitle="For small teams"
              highlights={[
                "Up to 2,000 documents",
                "Shared workspace",
                "Roles + access control (soon)",
              ]}
              cta="Start Team"
              href={signInHref}
              variant="outline"
            />
          </Reveal>
        </div>

        <Reveal className="relative mt-6 overflow-hidden rounded-3xl bg-card/80 p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">Not sure yet?</div>
              <div className="text-sm text-muted-foreground">
                Start free, import later, upgrade when you feel the pain.
              </div>
            </div>
            <Button asChild>
              <Link href={signInHref}>Create your account</Link>
            </Button>
          </div>
        </Reveal>

      </RevealStagger>
    </section>
  );
}

function PricingCard(props: {
  title: string;
  price: string;
  subtitle: string;
  highlights: string[];
  cta: string;
  href: string;
  featured?: boolean;
  variant?: "outline";
}) {
  return (
    <Card
      className={[
        "rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        props.featured ? "border-primary/40 shadow-md" : "",
      ].join(" ")}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{props.title}</CardTitle>
          {props.featured ? (
            <Badge className="bg-primary text-primary-foreground">
              Most popular
            </Badge>
          ) : null}
        </div>

        <div className="text-4xl font-semibold tracking-tight">{props.price}</div>
        <div className="text-sm text-muted-foreground">{props.subtitle}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {props.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <Button
          asChild
          className="w-full"
          variant={props.featured ? "default" : "outline"}
        >
          <Link href={props.href}>{props.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
