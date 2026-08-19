import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/fade-in";

const testimonials = [
  {
    quote:
      "I finally understand why some of my outfits just weren't working. The color harmony breakdown alone was worth it.",
    name: "Maya R.",
    role: "Student",
  },
  {
    quote:
      "It's blunt in the best way. No sugar-coating, just an honest score and exactly what to fix.",
    name: "Jordan K.",
    role: "Content Creator",
  },
  {
    quote:
      "I use it before every client meeting now. Takes ten seconds and I walk out more confident.",
    name: "Alex P.",
    role: "Professional",
  },
  {
    quote:
      "The occasion match feature saved me from wearing the wrong fit to a wedding. Genuinely useful.",
    name: "Sam T.",
    role: "Casual User",
  },
  {
    quote:
      "Watching my average score climb over a few months has been oddly motivating.",
    name: "Priya N.",
    role: "Fashion Enthusiast",
  },
  {
    quote:
      "The community feed is where I get the most value now — comparing fits and picking up ideas.",
    name: "Leo M.",
    role: "Content Creator",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Real fits, real feedback"
          title="What people are saying"
        />

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem
              key={t.name}
              className="flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-8"
            >
              <p className="text-[15px] leading-relaxed text-foreground/90">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
