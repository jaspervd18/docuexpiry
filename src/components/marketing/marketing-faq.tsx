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
          <p className="text-muted-foreground">The usual questions—answered.</p>
        </Reveal>

        <Reveal>
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
        </Reveal>
      </RevealStagger>
    </section>
  );
}
