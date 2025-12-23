"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, BellRing, ShieldCheck, Clock, ArrowRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Separator } from "~/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function MarketingLanding(props: { signInHref: string; appHref: string }) {
  const { signInHref } = props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <span>DocuExpiry</span>
            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">Beta</Badge>
          </Link>

          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#features">Features</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#pricing">Pricing</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={signInHref}>Sign in</Link>
            </Button>
            <Button asChild>
              <Link href={signInHref}>
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft pastel blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-[-120px] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <div className="space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Track expirations. Prevent surprises.
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                Never miss a document expiration again.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-pretty text-base text-muted-foreground sm:text-lg">
                DocuExpiry keeps your certificates, licenses, contracts, and compliance docs organized—then
                nudges you before they expire. Built for solo operators and small teams.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="group">
                  <Link href={signInHref}>
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
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
                <MiniStat icon={<Clock className="h-4 w-4" />} title="2 min setup" desc="Add a doc + date." />
                <MiniStat icon={<BellRing className="h-4 w-4" />} title="Smart reminders" desc="Before expiry." />
                <MiniStat icon={<ShieldCheck className="h-4 w-4" />} title="Private by default" desc="Per-user data." />
              </motion.div>
            </div>

            {/* hero card mock */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-xl" />
              <Card className="relative overflow-hidden rounded-3xl border bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Expirations overview
                    <Badge variant="outline">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DemoRow name="Insurance certificate" meta="Vehicle" badge="12d left" tone="warn" />
                  <DemoRow name="Safety inspection" meta="Compliance" badge="Valid" tone="ok" />
                  <DemoRow name="ISO audit report" meta="Compliance" badge="Expired" tone="bad" />
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next reminder</span>
                    <span className="font-medium">In 3 days</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-8 flex items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need, nothing you don’t</h2>
              <p className="text-muted-foreground">Fast, focused, and built for small businesses.</p>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="Quick add"
              desc="Add a document name, expiry date, category + tags. Upload later if you want."
            />
            <FeatureCard
              icon={<BellRing className="h-5 w-5 text-primary" />}
              title="Expiring soon view"
              desc="Instantly see what needs attention this month."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Private by default"
              desc="Your documents are scoped to your account. Multi-tenant ready when you are."
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Smart sorting"
              desc="Sort by expiry date, category, or name—so urgent items rise to the top."
            />
            <FeatureCard
              icon={<Check className="h-5 w-5 text-primary" />}
              title="Clean workflow"
              desc="Dashboard → Documents → Add. No clutter."
            />
            <FeatureCard
              icon={<ArrowRight className="h-5 w-5 text-primary" />}
              title="Built to scale"
              desc="tRPC + Prisma + Next.js app router. Add team support when needed."
            />
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Simple pricing</h2>
          <p className="text-muted-foreground">Start free, upgrade when it saves you time.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PricingCard
            title="Free"
            price="€0"
            subtitle="For trying it out"
            highlights={["Up to 10 documents", "Categories + tags", "Dashboard + table view"]}
            cta="Start free"
            href={signInHref}
            variant="outline"
          />
          <PricingCard
            title="Solo"
            price="€5"
            subtitle="For one-person businesses"
            highlights={["Up to 200 documents", "Expiring soon alerts", "Priority roadmap voting"]}
            cta="Go Solo"
            href={signInHref}
            featured
          />
          <PricingCard
            title="Team"
            price="€12"
            subtitle="For small teams"
            highlights={["Up to 2,000 documents", "Shared workspace", "Roles + access control (soon)"]}
            cta="Start Team"
            href={signInHref}
            variant="outline"
          />
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">Not sure yet?</div>
              <div className="text-sm text-muted-foreground">Start free, import later, upgrade when you feel the pain.</div>
            </div>
            <Button asChild>
              <Link href={signInHref}>Create your account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Document expiration tracking for small businesses</h2>
            <p className="text-muted-foreground">
              Whether it’s insurance certificates, safety inspections, compliance docs, or client contracts—
              DocuExpiry helps you stay ahead. Keep everything searchable, categorized, and easy to audit.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Know what expires next and when.
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Reduce last-minute renewals and missed deadlines.
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Build an “audit-ready” habit from day one.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="text-sm font-medium">Popular use cases</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <UseCase title="Insurance & certificates" desc="Track renewals for vehicles, equipment, and liability." />
              <UseCase title="Compliance docs" desc="ISO, safety checks, training, site access permits." />
              <UseCase title="Client contracts" desc="Know when agreements end or auto-renew." />
              <UseCase title="Licenses" desc="Professional registrations, permits, and more." />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
          <p className="text-muted-foreground">The usual questions—answered.</p>
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border bg-card p-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>Do I need to upload files?</AccordionTrigger>
            <AccordionContent>
              Nope. Start with name + expiry date. File upload is optional and will be a paid feature later.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do reminders work?</AccordionTrigger>
            <AccordionContent>
              You’ll see an “expiring soon” list now. Email reminders can come next once the workflow is solid.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is Google sign-in free?</AccordionTrigger>
            <AccordionContent>
              Yes—using Google OAuth via NextAuth is free. You only pay for your hosting and database usage.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-8 sm:p-10">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">Ready to stop chasing expirations?</h3>
              <p className="text-muted-foreground">Start free and add your first document in under 2 minutes.</p>
            </div>
            <Button asChild size="lg" className="group">
              <Link href={signInHref}>
                Start free <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        <footer className="mt-10 border-t pt-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-0 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} DocuExpiry</div>
            <div className="flex gap-4">
              <a className="hover:text-foreground transition-colors" href="#pricing">Pricing</a>
              <a className="hover:text-foreground transition-colors" href="#features">Features</a>
              <a className="hover:text-foreground transition-colors" href="#faq">FAQ</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

function MiniStat(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-primary">{props.icon}</span>
        {props.title}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}

function FeatureCard(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="group rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-105">
          {props.icon}
        </div>
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{props.desc}</CardContent>
    </Card>
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
          {props.featured ? <Badge className="bg-primary text-primary-foreground">Most popular</Badge> : null}
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
        <Button asChild className="w-full" variant={props.featured ? "default" : "outline"}>
          <Link href={props.href}>{props.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function UseCase(props: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-sm font-medium">{props.title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}

function DemoRow(props: { name: string; meta: string; badge: string; tone: "warn" | "ok" | "bad" }) {
  const badgeClass =
    props.tone === "bad"
      ? "bg-destructive text-destructive-foreground"
      : props.tone === "warn"
        ? "bg-primary/20 text-foreground"
        : "bg-muted text-foreground";

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background p-3 transition-all duration-200 hover:shadow-md">
      <div>
        <div className="text-sm font-medium">{props.name}</div>
        <div className="text-xs text-muted-foreground">{props.meta}</div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs ${badgeClass}`}>{props.badge}</span>
    </div>
  );
}
