"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

import { AnimatedHeading } from "./animated-heading";
import { AnimatedCounter } from "./animated-counter";
import { Reveal, RevealStagger } from "./reveal";
import { PixiFallback } from "./pixi/pixi-fallback";
import { Button } from "~/components/ui/button";

const PixiHeroCanvas = dynamic(
  () => import("./pixi/pixi-hero-canvas").then((m) => ({ default: m.PixiHeroCanvas })),
  { ssr: false },
);

export function MarketingStoryHook(props: { signInHref: string }) {
  const { signInHref } = props;

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* PixiJS particle background with CSS fallback */}
      <PixiHeroCanvas />
      <PixiFallback />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-sm backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
            Never miss another expiry
          </div>
        </Reveal>

        <AnimatedHeading
          as="h1"
          animation="word-reveal"
          className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Your passport expired last Tuesday.
        </AnimatedHeading>

        <Reveal delay={0.3}>
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            You found out at the airport. That trip you planned for months? Gone.
            DocuExpiry makes sure that never happens again. Track every expiry
            date in one place and get reminded before it&apos;s too late.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group shadow-sm hover:shadow-md">
              <Link href={signInHref} className="relative">
                <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                Start tracking for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="backdrop-blur">
              <a href="#solution">See how it works</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <p className="mt-3 text-xs text-muted-foreground">
            Free forever for up to 10 documents. No credit card required.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-3">
          <Reveal>
            <StatCard>
              <AnimatedCounter target={4200} suffix="+" className="text-2xl font-bold" />
              <span className="text-sm text-muted-foreground">Documents tracked</span>
            </StatCard>
          </Reveal>
          <Reveal>
            <StatCard>
              <span className="text-2xl font-bold">2 min</span>
              <span className="text-sm text-muted-foreground">Average setup time</span>
            </StatCard>
          </Reveal>
          <Reveal>
            <StatCard>
              <span className="text-2xl font-bold">Zero</span>
              <span className="text-sm text-muted-foreground">Surprises at the airport</span>
            </StatCard>
          </Reveal>
        </RevealStagger>
      </div>
    </section>
  );
}

function StatCard(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/60 px-6 py-4 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {props.children}
    </div>
  );
}
