"use client";

import { BellRing, Lock, Shield } from "lucide-react";

import { AnimatedHeading } from "./animated-heading";
import { AnimatedCounter } from "./animated-counter";
import { Reveal, RevealStagger } from "./reveal";

const TESTIMONIALS = [
  {
    quote:
      "I got a reminder 30 days before my passport expired. Renewed it in time and flew out stress-free.",
    name: "Sarah M.",
    role: "Freelancer",
    initials: "SM",
  },
  {
    quote:
      "We track 150+ compliance documents. The automatic reminders mean we never scramble before an audit anymore.",
    name: "Tom K.",
    role: "Operations Manager",
    initials: "TK",
  },
  {
    quote:
      "Set it up in 2 minutes, got my first reminder a week later. It just works.",
    name: "Ayesha R.",
    role: "Small Business Owner",
    initials: "AR",
  },
];

const TRUST_BADGES = [
  { icon: <Lock className="h-4 w-4" />, label: "SSL secured" },
  { icon: <Shield className="h-4 w-4" />, label: "GDPR compliant" },
  { icon: <BellRing className="h-4 w-4" />, label: "Email, SMS & WhatsApp" },
];

export function MarketingSocialProof() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <AnimatedHeading
          as="h2"
          animation="fade-up"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Trusted by people who hate surprises
        </AnimatedHeading>
      </div>

      {/* Stats row */}
      <RevealStagger className="mb-14 grid gap-6 sm:grid-cols-3">
        <Reveal>
          <div className="flex flex-col items-center gap-1 py-4">
            <AnimatedCounter
              target={4200}
              suffix="+"
              className="text-3xl font-bold"
            />
            <span className="text-sm text-muted-foreground">
              Documents tracked
            </span>
          </div>
        </Reveal>
        <Reveal>
          <div className="flex flex-col items-center gap-1 py-4">
            <AnimatedCounter
              target={12}
              suffix="k+"
              className="text-3xl font-bold"
            />
            <span className="text-sm text-muted-foreground">
              Reminders sent
            </span>
          </div>
        </Reveal>
        <Reveal>
          <div className="flex flex-col items-center gap-1 py-4">
            <AnimatedCounter
              target={3}
              className="text-3xl font-bold"
            />
            <span className="text-sm text-muted-foreground">
              Reminder channels
            </span>
          </div>
        </Reveal>
      </RevealStagger>

      {/* Testimonials */}
      <RevealStagger className="mb-12 grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Reveal key={t.name}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-card/80 p-6">
              <blockquote className="mb-4 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </RevealStagger>

      {/* Trust badges */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-primary">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
