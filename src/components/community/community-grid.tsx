import {
  Footprints,
  Glasses,
  PersonStanding,
  Shirt,
  ShoppingBag,
  Watch,
} from "lucide-react";

import { FitcheckCard, type Fitcheck } from "@/components/community/fitcheck-card";
import { CommunityMilestone } from "@/components/community/community-milestone";
import { Stagger, StaggerItem } from "@/components/shared/fade-in";
import { COMMUNITY_UNLOCKED } from "@/lib/community";

const ICONS = [Shirt, PersonStanding, Footprints, Watch, ShoppingBag, Glasses];

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[2/3]",
  "aspect-[3/5]",
  "aspect-[4/5]",
];

const TONES = [
  "bg-gradient-to-br from-muted via-background to-muted",
  "bg-gradient-to-tr from-secondary via-muted to-background",
  "bg-[radial-gradient(circle_at_25%_20%,var(--muted),var(--background)_70%)]",
  "bg-gradient-to-b from-background via-muted to-secondary",
  "bg-[radial-gradient(circle_at_75%_30%,var(--secondary),var(--background)_65%)]",
  "bg-gradient-to-tl from-muted to-background",
];

const RAW: { name: string; archetype: string; score: number; likes: number }[] = [
  { name: "Maya Reyes", archetype: "Streetwear", score: 9.2, likes: 214 },
  { name: "Jordan Kim", archetype: "Old Money", score: 8.7, likes: 132 },
  { name: "Alex Park", archetype: "Techwear", score: 9.0, likes: 301 },
  { name: "Sam Torres", archetype: "Minimalist", score: 8.4, likes: 98 },
  { name: "Priya Nair", archetype: "Y2K Revival", score: 9.4, likes: 268 },
  { name: "Leo Mensah", archetype: "Smart Casual", score: 8.1, likes: 76 },
  { name: "Iris Chen", archetype: "Coastal", score: 8.9, likes: 154 },
  { name: "Noah Brandt", archetype: "Workwear", score: 8.3, likes: 88 },
  { name: "Ege Yildiz", archetype: "Dark Academia", score: 9.1, likes: 189 },
  { name: "Zuri Osei", archetype: "Athleisure", score: 7.9, likes: 61 },
  { name: "Mila Novak", archetype: "Balletcore", score: 9.3, likes: 245 },
  { name: "Theo Laurent", archetype: "Preppy", score: 8.6, likes: 117 },
  { name: "Ana Souza", archetype: "Grunge Revival", score: 8.8, likes: 143 },
  { name: "Kian Walsh", archetype: "Skater", score: 8.0, likes: 69 },
  { name: "Runa Sato", archetype: "Business Casual", score: 9.0, likes: 176 },
  { name: "Dev Patel", archetype: "Streetwear", score: 8.5, likes: 104 },
];

const fitchecks: Fitcheck[] = RAW.map((item, i) => ({
  id: `${i}-${item.name}`,
  ...item,
  aspect: ASPECTS[i % ASPECTS.length],
  tone: TONES[i % TONES.length],
  icon: ICONS[i % ICONS.length],
}));

function MasonryGrid({ items }: { items: Fitcheck[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <FitcheckCard item={item} />
        </div>
      ))}
    </div>
  );
}

export function CommunityGrid() {
  if (!COMMUNITY_UNLOCKED) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none max-h-[720px] overflow-hidden opacity-40 blur-sm select-none [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        >
          <MasonryGrid items={fitchecks} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-background/40 px-6 backdrop-blur-[2px]">
          <CommunityMilestone />
        </div>
      </div>
    );
  }

  return (
    <Stagger
      stagger={0.03}
      className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
    >
      {fitchecks.map((item) => (
        <StaggerItem key={item.id} className="break-inside-avoid">
          <FitcheckCard item={item} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
