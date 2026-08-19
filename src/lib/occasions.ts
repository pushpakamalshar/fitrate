export type OccasionId = "date" | "interview" | "casual" | "formal";

export type Occasion = {
  id: OccasionId;
  label: string;
  description: string;
  /** Guidance injected into the AI prompt so the review is judged against this occasion. */
  prompt: string;
};

export const OCCASIONS: Occasion[] = [
  {
    id: "date",
    label: "A date",
    description: "Romantic, put-together, a little intentional",
    prompt:
      "a date — the outfit should read as attractive, intentional, and a little effortful without trying too hard",
  },
  {
    id: "interview",
    label: "Job interview",
    description: "Polished, credible, role-appropriate",
    prompt:
      "a job interview — the outfit should read as polished, professional, and credible, avoiding anything distracting or too casual",
  },
  {
    id: "casual",
    label: "Casual meeting",
    description: "Relaxed but pulled together",
    prompt:
      "a casual meetup with friends or acquaintances — the outfit should read as relaxed and comfortable while still looking pulled together",
  },
  {
    id: "formal",
    label: "Formal event",
    description: "Elevated, elegant, occasion-worthy",
    prompt:
      "a formal event — the outfit should read as elevated, elegant, and appropriate for a black-tie or upscale occasion",
  },
];

export const DEFAULT_OCCASION: OccasionId = "casual";

export function getOccasion(id: string | null | undefined): Occasion {
  return OCCASIONS.find((o) => o.id === id) ?? OCCASIONS.find((o) => o.id === DEFAULT_OCCASION)!;
}
