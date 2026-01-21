"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

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
  return (
    <motion.div
      className={props.className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: props.once ?? true, amount: 0.18 }}
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
  return (
    <motion.div
      className={props.className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: props.once ?? true, amount: 0.18 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {props.children}
    </motion.div>
  );
}
