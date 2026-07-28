"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  // Respect prefers-reduced-motion: fade only, no travel.
  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.2 : 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : i * 0.08,
      },
    }),
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}
