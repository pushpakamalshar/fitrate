import {
  Palette,
  PersonStanding,
  Layers,
  Watch,
  Footprints,
  CalendarCheck,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/fade-in";

const pillars = [
  {
    icon: Palette,
    title: "Color Harmony",
    description:
      "How well your palette works together — contrast, tone, and balance across every piece.",
  },
  {
    icon: PersonStanding,
    title: "Fit & Silhouette",
    description:
      "Proportion, drape, and how the outfit sits on your frame from head to toe.",
  },
  {
    icon: Layers,
    title: "Layering",
    description:
      "Whether your layers build depth and structure, or compete with each other.",
  },
  {
    icon: Watch,
    title: "Accessories",
    description:
      "Jewelry, bags, and details — evaluated for whether they elevate or distract.",
  },
  {
    icon: Footprints,
    title: "Footwear",
    description:
      "Shoe choice measured against the rest of the outfit for cohesion.",
  },
  {
    icon: CalendarCheck,
    title: "Occasion Match",
    description:
      "Whether the fit actually suits where you're wearing it — work, night out, or casual.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="What we analyze"
          title="Every detail, scored objectively"
          description="Ten data points, one clear picture of how your outfit actually reads."
        />

        <Stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title} className="bg-card p-8">
              <pillar.icon className="size-6 text-foreground" strokeWidth={1.5} />
              <h3 className="mt-5 text-lg font-medium">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
