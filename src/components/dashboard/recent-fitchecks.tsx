import { Images } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOccasion } from "@/lib/occasions";
import type { FitcheckSummary } from "@/types/analysis";

export function RecentFitchecks({ fitchecks }: { fitchecks: FitcheckSummary[] }) {
  if (fitchecks.length === 0) {
    return (
      <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Images className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">No fitchecks yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Upload your first outfit above and your rating history will show up here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {fitchecks.map((fit) => (
        <div
          key={fit.id}
          className="group overflow-hidden rounded-2xl border border-border/80 bg-card"
        >
          <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fit.imageUrl}
              alt="Outfit fitcheck"
              className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
            {fit.overallScore !== null && (
              <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                {fit.overallScore.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 p-2.5">
            <span className="truncate text-xs text-muted-foreground">
              {getOccasion(fit.occasion).label}
            </span>
            {fit.visibility === "public" && (
              <Badge variant="outline" className="shrink-0">
                Public
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
