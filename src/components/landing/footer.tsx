import Link from "next/link";

import { Container } from "@/components/shared/container";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Analysis", href: "#features" },
      { label: "Community", href: "#community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-3">
            <span className="text-lg font-semibold tracking-tight">fitrate</span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Instant, objective AI feedback on your outfits — rate, track,
              and share your style.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-sm font-medium">{col.title}</span>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} fitrate. All rights reserved.
          </span>
        </div>
      </Container>
    </footer>
  );
}
