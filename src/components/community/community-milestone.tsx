import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COMMUNITY_GOAL, COMMUNITY_JOINED } from "@/lib/community";

export function CommunityMilestone() {
  const percent = Math.round((COMMUNITY_JOINED / COMMUNITY_GOAL) * 100);
  const remaining = COMMUNITY_GOAL - COMMUNITY_JOINED;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-border bg-foreground px-8 py-12 text-center text-background shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] sm:px-10 sm:py-14">
      <div className="flex size-12 items-center justify-center rounded-full bg-background/10">
        <Lock className="size-5" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          {COMMUNITY_JOINED} people have joined — {remaining} to go
        </h2>
        <p className="text-sm leading-relaxed text-background/70">
          The community feed unlocks at {COMMUNITY_GOAL} members. Upload your
          fit to help us get there and be one of the first to see everyone
          else&apos;s.
        </p>
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/15">
          <div
            className="h-full rounded-full bg-background transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-background/60">
          <span>
            {COMMUNITY_JOINED}/{COMMUNITY_GOAL} joined
          </span>
          <span>{percent}%</span>
        </div>
      </div>

      <Button
        className="h-11 w-full rounded-full bg-background text-sm text-foreground hover:bg-background/90"
        render={<Link href="/dashboard" />}
        nativeButton={false}
      >
        Upload your fit
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
