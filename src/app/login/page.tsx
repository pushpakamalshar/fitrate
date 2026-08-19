import type { Metadata } from "next";
import { GoogleAuthCard } from "@/components/auth/google-auth-card";

export const metadata: Metadata = {
  title: "Log in — fitrate",
  description: "Sign in to fitrate with Google to see your ratings and fitcheck history.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-24">
      <GoogleAuthCard mode="login" next={next} />
    </div>
  );
}
