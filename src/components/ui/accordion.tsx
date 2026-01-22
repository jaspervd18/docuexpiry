"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "~/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group rounded-xl border border-border/60 bg-background/40 px-3",
        "not-first:mt-2",
        "transition-all hover:border-primary/25 hover:bg-primary/5",
        "focus-within:ring-1 focus-within:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4",
          "py-4 text-left text-sm font-medium",
          "rounded-lg outline-none transition-colors",
          "hover:text-foreground/90",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=open]:text-foreground",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        <span className="relative">
          {children}
          <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full bg-primary/0 transition-colors group-hover:bg-primary/20 group-data-[state=open]:bg-primary/20" />
        </span>

        <ChevronDownIcon
          className={cn(
            "pointer-events-none mt-0.5 size-4 shrink-0",
            "text-muted-foreground transition-transform duration-200",
            "group-hover:text-foreground/70",
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm text-muted-foreground", className)}
      {...props}
    >
      <div className="pb-4 pr-8">{children}</div>
    </AccordionPrimitive.Content>
  );
}


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
