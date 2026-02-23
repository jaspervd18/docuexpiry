"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { AnimatedHeading } from "./animated-heading";
import { Reveal, RevealStagger } from "./reveal";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function MarketingPricingV2(props: { signInHref: string }) {
  const { signInHref } = props;

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <AnimatedHeading
          as="h2"
          animation="gradient-sweep"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Simple, honest pricing
        </AnimatedHeading>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground">
            Start free. Upgrade when you need more room.
          </p>
        </Reveal>
      </div>

      <RevealStagger className="grid gap-4 lg:grid-cols-3">
        <Reveal>
          <PricingCard
            title="Free"
            price="€0"
            subtitle="For trying it out"
            highlights={[
              "Up to 10 documents",
              "Categories & tags",
              "Email reminders",
              "CSV import",
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
              "Everything in Free",
              "Custom reminder schedules",
              "File attachments",
              "Priority support",
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
              "Everything in Solo",
              "Shared workspace",
              "Roles & access control",
            ]}
            cta="Start Team"
            href={signInHref}
            variant="outline"
          />
        </Reveal>
      </RevealStagger>

      <Reveal className="mt-8 text-center">
        <Link
          href="/pricing"
          className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          See full feature comparison
        </Link>
      </Reveal>
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
        "relative rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        props.featured
          ? "border-primary/40 shadow-md ring-1 ring-primary/20"
          : "",
      ].join(" ")}
    >
      {/* Glow on featured card */}
      {props.featured && (
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-primary/5 blur-sm" />
      )}

      <CardHeader className="relative space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{props.title}</CardTitle>
          {props.featured && (
            <Badge className="bg-primary text-primary-foreground">
              Most popular
            </Badge>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight">{props.price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <div className="text-sm text-muted-foreground">{props.subtitle}</div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <ul className="space-y-2 text-sm">
          {props.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
