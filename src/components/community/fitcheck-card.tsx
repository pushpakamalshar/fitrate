import { Heart, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Fitcheck = {
  id: string;
  name: string;
  archetype: string;
  score: number;
  likes: number;
  aspect: string;
  tone: string;
  icon: LucideIcon;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function FitcheckCard({ item }: { item: Fitcheck }) {
  const Icon = item.icon;

  return (
    <div className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-card transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          item.aspect
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-[1.03]",
            item.tone
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className="size-16 text-foreground/10 sm:size-20"
            strokeWidth={1}
          />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
          {item.score.toFixed(1)}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          {item.archetype}
        </span>
      </div>

      <div className="flex items-center gap-2.5 p-3">
        <Avatar size="sm">
          <AvatarFallback>{initials(item.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {item.name}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Heart className="size-3.5" />
          {item.likes}
        </div>
      </div>
    </div>
  );
}
