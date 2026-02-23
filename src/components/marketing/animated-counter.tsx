"use client";

import * as React from "react";
import { useInView, useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    const n = Math.round(v);
    return `${prefix}${n.toLocaleString("en-US")}${suffix}`;
  });
  const [text, setText] = React.useState(`${prefix}0${suffix}`);

  React.useEffect(() => {
    if (!inView) return;

    const controls = animate(motionVal, target, {
      duration,
      ease: "easeOut",
    });

    const unsub = display.on("change", (v) => setText(v));

    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, target, duration, motionVal, display]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ scale: 1 }}
      animate={inView ? { scale: [1, 1.05, 1] } : {}}
      transition={{ delay: duration, duration: 0.3 }}
    >
      {text}
    </motion.span>
  );
}
