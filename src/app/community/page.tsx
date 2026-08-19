import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { Container } from "@/components/shared/container";
import { CommunityHeader } from "@/components/community/community-header";
import { CommunityGrid } from "@/components/community/community-grid";
import { COMMUNITY_UNLOCKED } from "@/lib/community";

export const metadata: Metadata = {
  title: "Community — fitrate",
  description: "Browse fitchecks shared by the fitrate community.",
};

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/community");
  }

  const metadata = user.user_metadata ?? {};
  const name: string =
    metadata.full_name ?? metadata.name ?? user.email?.split("@")[0] ?? "there";
  const avatarUrl: string | null = metadata.avatar_url ?? metadata.picture ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <DashboardNavbar user={{ name, email: user.email ?? null, avatarUrl }} />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="flex flex-col gap-8">
          <CommunityHeader />
          <CommunityGrid />

          {COMMUNITY_UNLOCKED ? (
            <p className="pb-4 pt-2 text-center text-xs text-muted-foreground">
              You&apos;re all caught up — new fits drop daily.
            </p>
          ) : null}
        </Container>
      </main>
    </div>
  );
}
