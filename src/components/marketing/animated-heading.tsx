"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { usePageReady } from "./marketing-ready-provider";

type AnimationStyle = "word-reveal" | "gradient-sweep" | "character-reveal" | "fade-up";

interface AnimatedHeadingProps {
  children: string;
  as?: "h1" | "h2" | "h3";
  animation?: AnimationStyle;
  className?: string;
}

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  animation = "fade-up",
  className = "",
}: AnimatedHeadingProps) {
  const ready = usePageReady();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const active = ready && inView;

  if (animation === "word-reveal") {
    const words = children.split(" ");
    return (
      <Tag className={className}>
        <motion.span
          ref={ref}
          className="inline-flex flex-wrap gap-x-[0.3em]"
          initial="hidden"
          animate={active ? "show" : "hidden"}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  if (animation === "gradient-sweep") {
    return (
      <Tag className={className} ref={ref}>
        <motion.span
          className="inline-block bg-gradient-to-r from-primary via-foreground to-foreground bg-[length:200%_100%] bg-clip-text text-transparent"
          initial={{ backgroundPosition: "100% 0" }}
          animate={active ? { backgroundPosition: "0% 0" } : { backgroundPosition: "100% 0" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  if (animation === "character-reveal") {
    return <CharacterRevealHeading tag={Tag} className={className} text={children} />;
  }

  // fade-up (default)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}

/* ---- character-reveal (text scramble) ---- */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function CharacterRevealHeading({
  tag: Tag,
  className,
  text,
}: {
  tag: "h1" | "h2" | "h3";
  className: string;
  text: string;
}) {
  const ready = usePageReady();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const active = ready && inView;
  const [display, setDisplay] = React.useState(text);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const totalFrames = 20;
    const id = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (frame / totalFrames >= (i + 1) / text.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)]!;
          })
          .join(""),
      );
    }, 35);

    return () => clearInterval(id);
  }, [active, text]);

  return (
    <div ref={ref}>
      <Tag className={className}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {display}
        </motion.span>
      </Tag>
    </div>
  );
}
