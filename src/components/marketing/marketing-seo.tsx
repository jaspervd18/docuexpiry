"use client";

import { Check } from "lucide-react";
import { Reveal, RevealStagger } from "./reveal";

export function MarketingSeoBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      <RevealStagger className="grid gap-10 lg:grid-cols-2">
        <Reveal className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Stop forgetting, start tracking
          </h2>
          <p className="text-muted-foreground">
            Whether it&#39;s your passport, car insurance, a client contract, or
            an ISO certificate, DocuExpiry gives you one place to track it all.
            Add a name and a date, and we&#39;ll remind you before it&#39;s too late.
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
              Works for personal docs and business compliance.
            </li>
          </ul>
        </Reveal>

        <Reveal className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">
            Popular use cases
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <UseCase
              icon="🪪"
              title="Personal documents"
              desc="Passports, driving licences, ID cards, visas."
            />
            <UseCase
              icon="📋"
              title="Compliance"
              desc="ISO certificates, safety checks, training records."
            />
            <UseCase
              icon="🚗"
              title="Insurance & vehicles"
              desc="Car insurance, MOT, road tax, equipment cover."
            />
            <UseCase
              icon="📄"
              title="Licenses & permits"
              desc="Professional registrations, permits, and more."
            />
          </div>
        </Reveal>
      </RevealStagger>
    </section>
  );
}

function UseCase(props: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="mb-2 text-xl">{props.icon}</div>
      <div className="text-sm font-medium">{props.title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
    </div>
  );
}

