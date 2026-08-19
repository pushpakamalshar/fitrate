import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/fade-in";

const steps = [
  {
    number: "01",
    title: "Upload your fit",
    description: "Drag and drop a full-body photo, or snap one right from your camera.",
  },
  {
    number: "02",
    title: "AI analyzes",
    description: "Our model breaks down color, fit, style, and eight other categories.",
  },
  {
    number: "03",
    title: "Get your score",
    description: "Receive an overall rating with strengths, weaknesses, and suggestions.",
  },
  {
    number: "04",
    title: "Save & share",
    description: "Keep it in your history, or publish it to the community for feedback.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-24 md:py-32">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="How it works"
          title="From photo to feedback in seconds"
          description="No sign-up friction, no waiting around. Just upload and see."
        />

        <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem key={step.number} className="flex flex-col gap-4">
              <span className="font-mono text-sm text-muted-foreground">
                {step.number}
              </span>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
