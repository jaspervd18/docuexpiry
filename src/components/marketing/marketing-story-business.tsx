"use client";

import {
  Briefcase,
  Car,
  FileCheck,
  Globe,
  HeartPulse,
  UserCheck,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { AnimatedHeading } from "./animated-heading";
import { Reveal, RevealStagger } from "./reveal";

const USE_CASES = [
  {
    icon: <UserCheck className="h-5 w-5" />,
    title: "Personal documents",
    desc: "Passports, driving licences, ID cards, visas. The stuff that ruins holidays when it's expired.",
  },
  {
    icon: <Car className="h-5 w-5" />,
    title: "Insurance & vehicles",
    desc: "Car insurance, MOT, road tax. Never drive uninsured again.",
  },
  {
    icon: <FileCheck className="h-5 w-5" />,
    title: "Business compliance",
    desc: "ISO certificates, safety inspections, training records. Stay audit-ready.",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Contracts & licences",
    desc: "Client contracts, professional registrations, permits. Renewals on autopilot.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Subscriptions",
    desc: "Domain names, SSL certificates, software licences. No more surprise downtimes.",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Health & safety",
    desc: "Fire extinguisher checks, first aid certs, medical clearances.",
  },
];

export function MarketingStoryBusiness() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="features" ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <AnimatedHeading
          as="h2"
          animation="gradient-sweep"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Not just personal
        </AnimatedHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto max-w-lg text-muted-foreground">
            From freelancers to teams. If it expires, it belongs in DocuExpiry.
          </p>
        </Reveal>
      </div>

      <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((uc, i) => (
          <Reveal key={uc.title}>
            <motion.div
              className="group flex h-full flex-col rounded-3xl border border-border/60 bg-card/80 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <motion.div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20"
                initial={{ scale: 1 }}
                animate={inView ? { scale: [1, 1.15, 1] } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              >
                {uc.icon}
              </motion.div>
              <div className="mb-2 text-sm font-medium">{uc.title}</div>
              <div className="text-sm text-muted-foreground">{uc.desc}</div>
            </motion.div>
          </Reveal>
        ))}
      </RevealStagger>
    </section>
  );
}
