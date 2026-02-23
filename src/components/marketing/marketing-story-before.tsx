"use client";

import { X } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { AnimatedHeading } from "./animated-heading";
import { Reveal, RevealStagger } from "./reveal";

const PAIN_POINTS = [
  "Sticky notes on the fridge with dates you can't read anymore.",
  "A spreadsheet you made in 2021 that nobody updates.",
  "Calendar reminders that got lost in the noise.",
  "That sinking feeling when you realize something expired last month.",
];

export function MarketingStoryBefore() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left: pain points */}
        <div>
          <AnimatedHeading
            as="h2"
            animation="gradient-sweep"
            className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Sound familiar?
          </AnimatedHeading>

          <RevealStagger className="space-y-4">
            {PAIN_POINTS.map((point, i) => (
              <Reveal key={i}>
                <div className="flex items-start gap-3 rounded-xl border border-destructive/10 bg-destructive/5 px-4 py-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-sm">{point}</span>
                </div>
              </Reveal>
            ))}
          </RevealStagger>

          <Reveal delay={0.5}>
            <p className="mt-8 text-lg font-medium text-muted-foreground">
              There&apos;s a simpler way.
            </p>
          </Reveal>
        </div>

        {/* Right: chaos card */}
        <Reveal delay={0.1}>
          <ChaosCard />
        </Reveal>
      </div>
    </section>
  );
}

function ChaosCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm sm:h-80"
    >
      {/* Scattered sticky notes */}
      {[
        { text: "Passport\nexp???", color: "bg-yellow-200/80", rotate: "-6deg", top: "8%", left: "5%" },
        { text: "Renew\ninsurance!!", color: "bg-pink-200/80", rotate: "4deg", top: "15%", left: "55%" },
        { text: "ISO cert\ncheck date", color: "bg-blue-200/80", rotate: "-3deg", top: "45%", left: "10%" },
        { text: "MOT due\n???", color: "bg-green-200/80", rotate: "7deg", top: "55%", left: "60%" },
      ].map((note, i) => (
        <motion.div
          key={i}
          className={`absolute w-24 rounded-md p-2.5 text-xs font-medium text-gray-700 shadow-sm ${note.color}`}
          style={{ top: note.top, left: note.left }}
          initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
          animate={
            inView
              ? { opacity: 1, rotate: note.rotate, scale: 1 }
              : { opacity: 0, rotate: 0, scale: 0.8 }
          }
          transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: "easeOut" }}
        >
          <span className="whitespace-pre-line">{note.text}</span>
        </motion.div>
      ))}

      {/* Fake spreadsheet fragment */}
      <motion.div
        className="absolute bottom-4 left-1/2 w-52 -translate-x-1/2 rounded-lg border border-border bg-white/90 p-2 shadow-sm dark:bg-gray-900/90"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <div className="w-20 border-r border-border/60 px-1 py-0.5 font-medium">Document</div>
          <div className="w-16 border-r border-border/60 px-1 py-0.5 font-medium">Expiry</div>
          <div className="flex-1 px-1 py-0.5 font-medium">Status</div>
        </div>
        <div className="flex items-center gap-1 text-[9px]">
          <div className="w-20 truncate border-r border-border/60 px-1 py-0.5">Passport</div>
          <div className="w-16 border-r border-border/60 px-1 py-0.5">??/??/24</div>
          <div className="flex-1 px-1 py-0.5 text-destructive">overdue?</div>
        </div>
        <div className="flex items-center gap-1 text-[9px]">
          <div className="w-20 truncate border-r border-border/60 px-1 py-0.5">Car ins.</div>
          <div className="w-16 border-r border-border/60 px-1 py-0.5">idk</div>
          <div className="flex-1 px-1 py-0.5 text-muted-foreground">check</div>
        </div>
      </motion.div>

      {/* EXPIRED stamp */}
      <motion.div
        className="absolute right-4 top-1/3 text-2xl font-black tracking-wider text-destructive/20"
        style={{ rotate: "-12deg" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ delay: 1.2, duration: 0.3, ease: "backOut" }}
      >
        EXPIRED
      </motion.div>
    </div>
  );
}
