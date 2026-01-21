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

        <Reveal className="rounded-3xl border bg-card p-6">
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
            <UseCase title="Licenses" desc="Professional registrations, permits, and more." />
          </div>
        </Reveal>
      </RevealStagger>
    </section>
  );
}

function UseCase(props: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-sm font-medium">{props.title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}
