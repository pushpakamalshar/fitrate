"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { RatingCard } from "@/components/landing/rating-card";

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-28 pt-8 md:pb-40 md:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-140 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--foreground)_0%,transparent_100%)] opacity-[0.05]"
      />

      <Container className="flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-0.5 text-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-foreground" />
            ))}
          </span>
          <span>12,000+ fits rated</span>
          <span className="text-border">·</span>
          <span className="uppercase tracking-wider">45,000+ analyses</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
          className="mt-6 max-w-3xl font-serif text-6xl leading-[1.05] tracking-tight text-balance sm:text-7xl md:text-8xl"
        >
          Know before
          <br />
          you walk in.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
          className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground"
        >
          A date, a job interview, a formal event, or just meeting friends. No
          opinions. Just clarity.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 }}
          className="mt-7 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="h-12 rounded-full px-7 text-base"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Review my outfit
            <ArrowRight className="size-4" />
          </Button>
          <Link
            href="#how-it-works"
            className="text-base text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
          className="mt-14 w-full"
        >
          <RatingCard />
        </motion.div>
      </Container>
    </section>
  );
}
