"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn } from "@/components/shared/fade-in";
import { COMMUNITY_UNLOCKED } from "@/lib/community";

const filters = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "following", label: "Following" },
  { value: "top", label: "Top Rated" },
];

export function CommunityHeader() {
  return (
    <FadeIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
          Community
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground sm:text-base">
          {COMMUNITY_UNLOCKED
            ? "Every fit the community has shared, rated by AI and voted on by real people."
            : "Fits are rolling in. The feed unlocks once 100 people have joined."}
        </p>
      </div>

      {COMMUNITY_UNLOCKED ? (
        <Tabs defaultValue="trending">
          <TabsList className="h-9">
            {filters.map((filter) => (
              <TabsTrigger key={filter.value} value={filter.value} className="px-3">
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}
    </FadeIn>
  );
}
