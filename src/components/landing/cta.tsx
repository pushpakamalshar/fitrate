import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <FadeIn className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-foreground px-8 py-20 text-center text-background md:px-16">
          <h2 className="max-w-xl font-serif text-4xl tracking-tight text-balance sm:text-5xl">
            See how your outfit actually rates.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-background/70">
            It takes ten seconds and it&apos;s free. Upload your first fit
            and get your score right now.
          </p>
          <Button
            size="lg"
            className="h-12 rounded-full bg-background px-7 text-base text-foreground hover:bg-background/90"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Rate my fit
            <ArrowRight className="size-4" />
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
