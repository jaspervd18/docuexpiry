"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { usePageReady } from "./marketing-ready-provider";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function Reveal(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ready = usePageReady();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: props.once ?? true, amount: 0.18 });

  // Only animate when the page is ready AND the element is in view
  const shouldShow = ready && inView;

  return (
    <motion.div
      ref={ref}
      className={props.className}
      variants={fadeUp}
      initial="hidden"
      animate={shouldShow ? "show" : "hidden"}
      transition={{ duration: 0.5, ease: "easeOut", delay: props.delay ?? 0 }}
    >
      {props.children}
    </motion.div>
  );
}

export function RevealStagger(props: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ready = usePageReady();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: props.once ?? true, amount: 0.18 });

  const shouldShow = ready && inView;

  return (
    <motion.div
      ref={ref}
      className={props.className}
      initial="hidden"
      animate={shouldShow ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {props.children}
    </motion.div>
  );
}
