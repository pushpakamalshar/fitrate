import type { Metadata } from "next";
import { GoogleAuthCard } from "@/components/auth/google-auth-card";

export const metadata: Metadata = {
  title: "Sign up — fitrate",
  description: "Create your fitrate account with Google and get instant AI outfit ratings.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-24">
      <GoogleAuthCard mode="signup" next={next} />
    </div>
  );
}
