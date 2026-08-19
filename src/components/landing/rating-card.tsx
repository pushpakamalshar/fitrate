"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shirt, Sparkles } from "lucide-react";

import { Progress } from "@/components/ui/progress";

const scores = [
  { label: "Color Harmony", value: 92 },
  { label: "Fit", value: 88 },
  { label: "Style", value: 95 },
  { label: "Accessories", value: 84 },
];

export function RatingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 16, filter: "blur(6px)" }
      }
      transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
      className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03),0_24px_60px_-30px_rgba(0,0,0,0.35)] sm:flex-row"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-2/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <Shirt className="size-20 text-muted-foreground/25" strokeWidth={1} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={
            inView
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.9, y: 6 }
          }
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.25 }}
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
        >
          <motion.span
            animate={
              inView
                ? { rotate: [0, 15, 0, -15, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
          >
            <Sparkles className="size-3.5" />
          </motion.span>
          Analyzed
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-8 text-left sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Overall score
            </span>
            <div className="mt-1 font-serif text-5xl leading-none">9.1</div>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Editorial · Clean
          </span>
        </motion.div>

        <div className="flex flex-col gap-4">
          {scores.map((score, i) => (
            <motion.div
              key={score.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-4"
            >
              <span className="w-28 shrink-0 text-sm text-muted-foreground">
                {score.label}
              </span>
              <Progress value={inView ? score.value : 0} className="flex-1">
                <span className="sr-only">{score.label}</span>
              </Progress>
              <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums">
                {(score.value / 10).toFixed(1)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
