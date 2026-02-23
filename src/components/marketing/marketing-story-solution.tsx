"use client";

import { BellRing, Mail, MessageCircle, Smartphone, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { AnimatedHeading } from "./animated-heading";
import { Reveal, RevealStagger } from "./reveal";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DocumentStatusBadge } from "~/components/document-status-badge";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const DEMO_DOCS = [
  { name: "Passport", meta: "Identity", expiresAt: daysFromNow(18) },
  { name: "Car insurance", meta: "Vehicle", expiresAt: daysFromNow(5) },
  { name: "ISO 27001 certificate", meta: "Compliance", expiresAt: daysFromNow(-3) },
  { name: "Driving licence", meta: "Identity", expiresAt: daysFromNow(240) },
];

export function MarketingStorySolution() {
  return (
    <section id="solution" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <AnimatedHeading
          as="h2"
          animation="character-reveal"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Meet DocuExpiry
        </AnimatedHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto max-w-xl text-muted-foreground">
            One place for every document that expires. Add it once, get
            reminded automatically. No spreadsheets, no sticky notes.
          </p>
        </Reveal>
      </div>

      {/* Demo card with animated rows */}
      <Reveal delay={0.15}>
        <DemoCard />
      </Reveal>

      {/* Reminder channels highlight */}
      <Reveal delay={0.2}>
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <h3 className="mb-2 text-base font-semibold">
            Reminders that actually reach you
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get notified 30, 7, and 1 day before expiry. Pick the channel you
            prefer. Never miss a deadline because you didn&apos;t check your email.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ReminderChannel
              icon={<Mail className="h-4 w-4" />}
              label="Email"
            />
            <ReminderChannel
              icon={<Smartphone className="h-4 w-4" />}
              label="SMS"
              soon
            />
            <ReminderChannel
              icon={<MessageCircle className="h-4 w-4" />}
              label="WhatsApp"
              soon
            />
          </div>
        </div>
      </Reveal>

      {/* Benefit cards */}
      <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-3">
        <Reveal>
          <BenefitCard
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            title="Add in seconds"
            desc="Name, category, expiry date. That's all you need. No file uploads required."
          />
        </Reveal>
        <Reveal>
          <BenefitCard
            icon={<BellRing className="h-5 w-5 text-primary" />}
            title="Smart reminders"
            desc="Customise when you get reminded. 30 days for a passport, 7 days for insurance. Your call."
          />
        </Reveal>
        <Reveal>
          <BenefitCard
            icon={<Mail className="h-5 w-5 text-primary" />}
            title="Your inbox, your schedule"
            desc="Reminders arrive by email. SMS and WhatsApp coming soon so you'll never miss one."
          />
        </Reveal>
      </RevealStagger>
    </section>
  );
}

function ReminderChannel(props: {
  icon: React.ReactNode;
  label: string;
  soon?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm">
      <span className="text-primary">{props.icon}</span>
      <span className="font-medium">{props.label}</span>
      {props.soon && (
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
          Soon
        </span>
      )}
    </div>
  );
}

function DemoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative mx-auto max-w-2xl">
      {/* Glow */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/8 to-transparent blur-xl" />

      <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm ring-1 ring-primary/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            Expirations overview
            <span className="text-xs font-normal text-muted-foreground">
              4 documents
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {DEMO_DOCS.map((doc, i) => (
            <motion.div
              key={doc.name}
              className="flex items-center justify-between gap-3 rounded-2xl bg-background/40 px-4 py-3 transition-colors hover:bg-primary/5"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                delay: 0.3 + i * 0.12,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">{doc.meta}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-sm text-muted-foreground sm:block">
                  {format(doc.expiresAt, "PP")}
                </div>
                <DocumentStatusBadge expiresAt={doc.expiresAt} />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Notification toast */}
      <motion.div
        className="absolute -right-2 top-16 z-20 w-64 rounded-xl border border-primary/20 bg-card/95 p-3 shadow-lg backdrop-blur sm:-right-8"
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={
          inView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: 60, scale: 0.95 }
        }
        transition={{ delay: 1, duration: 0.5, type: "spring", bounce: 0.25 }}
      >
        <div className="flex items-start gap-2">
          <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="text-xs font-medium">Reminder</div>
            <div className="text-xs text-muted-foreground">
              Car insurance expires in 5 days
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function BenefitCard(props: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="group flex h-full flex-col rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-105">
          {props.icon}
        </div>
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">
        {props.desc}
      </CardContent>
    </Card>
  );
}
