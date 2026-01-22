"use client";

import { Check } from "lucide-react";
import { Reveal, RevealStagger } from "./reveal";

export function MarketingSeoBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      <RevealStagger className="grid gap-10 lg:grid-cols-2">
        <Reveal className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Document expiration tracking for small businesses
          </h2>
          <p className="text-muted-foreground">
            Whether it’s insurance certificates, safety inspections, compliance
            docs, or client contracts—DocuExpiry helps you stay ahead. Keep
            everything searchable, categorized, and easy to audit.
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
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-3xl bg-card/80 p-6 shadow-sm">
          {/* soft glow */}
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          {/* contrast surface */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-primary/5" />

          {/* subtle boundary */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-border/30" />

          <div className="relative">
            <div className="text-sm font-medium">Popular use cases</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <UseCase
                title="Insurance & certificates"
                desc="Track renewals for vehicles, equipment, and liability."
              />
              <UseCase
                title="Compliance docs"
                desc="ISO, safety checks, training, site access permits."
              />
              <UseCase
                title="Client contracts"
                desc="Know when agreements end or auto-renew."
              />
              <UseCase
                title="Licenses"
                desc="Professional registrations, permits, and more."
              />
            </div>
          </div>
        </Reveal>
      </RevealStagger>
    </section>
  );
}

function UseCase(props: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/5hover:shadow-md">
      <div className="text-sm font-medium">{props.title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}

