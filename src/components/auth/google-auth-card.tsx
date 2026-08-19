"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogoMark } from "@/components/shared/logo-mark";
import { GoogleIcon } from "@/components/shared/google-icon";

type GoogleAuthCardProps = {
  mode: "login" | "signup";
  next?: string;
};

const copy = {
  login: {
    heading: "Welcome back",
    subheading: "Sign in to see your ratings and fitcheck history.",
    cta: "Don't have an account?",
    ctaHref: "/signup",
    ctaLabel: "Sign up",
  },
  signup: {
    heading: "Create your account",
    subheading: "Get instant AI ratings and styling advice for your outfits.",
    cta: "Already have an account?",
    ctaHref: "/login",
    ctaLabel: "Log in",
  },
} as const;

export function GoogleAuthCard({ mode, next = "/dashboard" }: GoogleAuthCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { heading, subheading, cta, ctaHref, ctaLabel } = copy[mode];

  async function handleGoogleAuth() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Link
        href="/"
        className="mb-8 flex items-center justify-center gap-2 text-foreground"
      >
        <LogoMark className="size-6" />
        <span className="text-lg font-medium tracking-tight">fitrate</span>
      </Link>

      <Card className="rounded-3xl px-2 py-8 shadow-sm">
        <CardContent className="flex flex-col items-center gap-6 px-6 text-center">
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">
              {heading}
            </h1>
            <p className="text-sm text-muted-foreground">{subheading}</p>
          </div>

          <Button
            onClick={handleGoogleAuth}
            disabled={loading}
            variant="outline"
            className={cn(
              "h-11 w-full rounded-full text-sm font-medium",
              "gap-2.5"
            )}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            Continue with Google
          </Button>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <p className="text-xs text-balance text-muted-foreground">
            By continuing, you agree to fitrate&apos;s{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {cta}{" "}
        <Link
          href={ctaHref}
          className="font-medium text-foreground underline underline-offset-2"
        >
          {ctaLabel}
        </Link>
      </p>
    </motion.div>
  );
}
