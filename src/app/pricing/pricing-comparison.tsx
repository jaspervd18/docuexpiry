"use client";

import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { PLAN_FEATURES, type FeatureValue } from "~/lib/plans";
import { Reveal, RevealStagger } from "~/components/marketing/reveal";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const PLANS_META = [
  { key: "free" as const, name: "Free", price: "€0", subtitle: "For trying it out", cta: "Start free" },
  { key: "solo" as const, name: "Solo", price: "€5", subtitle: "For one-person businesses", cta: "Go Solo", featured: true },
  { key: "team" as const, name: "Team", price: "€12", subtitle: "For small teams", cta: "Start Team" },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-primary" />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  }
  return <span className="text-sm">{value}</span>;
}

export function PricingComparison(props: { signInHref: string }) {
  const { signInHref } = props;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      {/* Header */}
      <Reveal className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick the plan that fits
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          All plans include email reminders, categories, and tags.
          Upgrade or downgrade anytime.
        </p>
      </Reveal>

      {/* Plan cards */}
      <RevealStagger className="mb-16 grid gap-4 lg:grid-cols-3">
        {PLANS_META.map((plan) => (
          <Reveal key={plan.key}>
            <Card
              className={[
                "relative rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                plan.featured ? "border-primary/40 shadow-md ring-1 ring-primary/20" : "",
              ].join(" ")}
            >
              {plan.featured && (
                <div className="pointer-events-none absolute -inset-px rounded-3xl bg-primary/5 blur-sm" />
              )}
              <CardHeader className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.featured && (
                    <Badge className="bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.subtitle}
                </div>
              </CardHeader>
              <CardContent className="relative">
                <Button
                  asChild
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  <Link href={signInHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </RevealStagger>

      {/* Feature comparison table — desktop */}
      <Reveal>
        <div className="hidden overflow-hidden rounded-2xl border border-border/60 sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/80">
                <TableHead className="w-[40%] font-medium">Feature</TableHead>
                <TableHead className="text-center font-medium">Free</TableHead>
                <TableHead className="text-center font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    Solo
                    <Badge variant="secondary" className="text-[10px]">
                      Popular
                    </Badge>
                  </span>
                </TableHead>
                <TableHead className="text-center font-medium">Team</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PLAN_FEATURES.map((feature) => (
                <TableRow key={feature.label}>
                  <TableCell className="font-medium">{feature.label}</TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={feature.free} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={feature.solo} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={feature.team} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Reveal>

      {/* Feature comparison — mobile (stacked cards) */}
      <RevealStagger className="space-y-6 sm:hidden">
        {PLANS_META.map((plan) => (
          <Reveal key={plan.key}>
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <span className="text-lg font-semibold">{plan.price}/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {PLAN_FEATURES.map((feature) => {
                    const val = feature[plan.key];
                    if (val === false) return null;
                    return (
                      <li key={feature.label} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>
                          {feature.label}
                          {typeof val === "string" ? `: ${val}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Button
                  asChild
                  className="mt-4 w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  <Link href={signInHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </RevealStagger>

      {/* Bottom CTA */}
      <Reveal className="mt-14 text-center">
        <p className="mb-4 text-muted-foreground">
          Ready to stop chasing expirations?
        </p>
        <Button asChild size="lg" className="group shadow-sm hover:shadow-md">
          <Link href={signInHref} className="relative">
            <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            Start free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </Reveal>

      {/* Footer */}
      <footer className="mt-16 pt-8">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; {new Date().getFullYear()} DocuExpiry</div>
          <div className="flex gap-4">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link
              href={signInHref}
              className="transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
