"use client";

import { Reveal, RevealStagger } from "./reveal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export function MarketingFaq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      <RevealStagger>
        <Reveal className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
          <p className="text-muted-foreground">The usual questions — answered.</p>
        </Reveal>

        <Reveal>
          <Accordion
            type="single"
            collapsible
          >
            <AccordionItem value="item-1" className="rounded-2xl bg-card/80 p-2 shadow-sm ring-1 ring-border/20">
              <AccordionTrigger>Do I need to upload files?</AccordionTrigger>
              <AccordionContent>
                Nope. Start with name + expiry date. File upload is optional and will be a paid feature later.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="rounded-2xl bg-card/80 p-2 shadow-sm ring-1 ring-border/20">
              <AccordionTrigger>How do reminders work?</AccordionTrigger>
              <AccordionContent>
                We send you email reminders 30 days, 7 days, and 1 day before a
                document expires. You can customise the schedule in your
                notification settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="rounded-2xl bg-card/80 p-2 shadow-sm ring-1 ring-border/20">
              <AccordionTrigger>Is it really free?</AccordionTrigger>
              <AccordionContent>
                Yes - the free plan gives you up to 10 documents with full email
                reminders. No credit card required. Upgrade to Solo or Team when
                you need more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="rounded-2xl bg-card/80 p-2 shadow-sm ring-1 ring-border/20">
              <AccordionTrigger>Can I use it for personal documents?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Passports, driving licences, car insurance, gym
                memberships, subscriptions - anything with an expiry date.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Reveal>
      </RevealStagger>
    </section>
  );
}
