import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { UploadPanel } from "@/components/dashboard/upload-panel";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentFitchecks } from "@/components/dashboard/recent-fitchecks";
import { Container } from "@/components/shared/container";
import type { FitcheckSummary } from "@/types/analysis";
import type { OccasionId } from "@/lib/occasions";

export const metadata: Metadata = {
  title: "Dashboard — fitrate",
  description: "Upload your outfit and get an instant AI-powered rating.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const metadata = user.user_metadata ?? {};
  const name: string =
    metadata.full_name ?? metadata.name ?? user.email?.split("@")[0] ?? "there";
  const avatarUrl: string | null = metadata.avatar_url ?? metadata.picture ?? null;

  const { data: fitcheckRows } = await supabase
    .from("fitchecks")
    .select("id, image_url, occasion, visibility, created_at, analyses(overall_score)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const fitchecks: FitcheckSummary[] = (fitcheckRows ?? []).map((row) => {
    const analysis = Array.isArray(row.analyses) ? row.analyses[0] : row.analyses;
    return {
      id: row.id,
      imageUrl: row.image_url,
      occasion: row.occasion as OccasionId,
      visibility: row.visibility as "private" | "public",
      createdAt: row.created_at,
      overallScore: analysis?.overall_score ?? null,
    };
  });

  const totalRated = fitchecks.length;
  const scored = fitchecks.filter((f) => f.overallScore !== null);
  const averageScore =
    scored.length > 0
      ? scored.reduce((sum, f) => sum + (f.overallScore ?? 0), 0) / scored.length
      : null;
  const now = new Date();
  const thisMonthCount = fitchecks.filter((f) => {
    const created = new Date(f.createdAt);
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <DashboardNavbar
        user={{ name, email: user.email ?? null, avatarUrl }}
      />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="flex flex-col gap-6 sm:gap-8">
          <div className="order-1">
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Welcome back, {name}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              Upload a fit to get your next rating, or check your recent fitchecks below.
            </p>
          </div>

          <UploadPanel className="order-2 sm:order-3" />

          <StatsOverview
            className="order-3 sm:order-2"
            totalRated={totalRated}
            averageScore={averageScore}
            thisMonthCount={thisMonthCount}
          />

          <div className="order-4">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Recent fitchecks
            </h2>
            <RecentFitchecks fitchecks={fitchecks.slice(0, 6)} />
          </div>
        </Container>
      </main>
    </div>
  );
}
