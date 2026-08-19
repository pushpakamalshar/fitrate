import { Shirt, Sparkles, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatsOverview({
  className,
  totalRated,
  averageScore,
  thisMonthCount,
}: {
  className?: string;
  totalRated: number;
  averageScore: number | null;
  thisMonthCount: number;
}) {
  const stats = [
    {
      label: "Fitchecks rated",
      value: String(totalRated),
      hint: totalRated === 0 ? "Upload your first outfit" : "Total analyses",
      icon: Shirt,
    },
    {
      label: "Average score",
      value: averageScore !== null ? averageScore.toFixed(1) : "—",
      hint: "Based on all your rated fits",
      icon: TrendingUp,
    },
    {
      label: "This month",
      value: String(thisMonthCount),
      hint: "New analyses",
      icon: Sparkles,
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-3xl border-border/80 shadow-sm">
          <CardContent className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <stat.icon className="size-4.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-2xl leading-none">{stat.value}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {stat.label} · {stat.hint}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
