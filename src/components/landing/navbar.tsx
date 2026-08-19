"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoMark } from "@/components/shared/logo-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const links = [
  { href: "#features", label: "Analysis" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#community", label: "Community" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      <header
        className={cn(
          "relative flex w-full items-center justify-between transition-all duration-300 ease-out",
          scrolled
            ? "mt-3 h-14 max-w-3xl rounded-full border border-border/80 bg-background/80 px-3 shadow-[0_10px_35px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl md:px-4"
            : "mt-0 h-16 max-w-6xl rounded-none border-b border-border/80 bg-background/80 px-6 shadow-none backdrop-blur-md md:px-10"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 pl-2 md:pl-0">
          <LogoMark className="size-5 text-foreground" />
          <span className="text-base font-medium tracking-tight">fitrate</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <div className="mx-2 h-5 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="rounded-full"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Get started
          </Button>
        </div>

        <div className="flex items-center gap-1 pr-2 md:hidden md:pr-0">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">fitrate</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    render={<Link href="/login" onClick={() => setOpen(false)} />}
                    nativeButton={false}
                  >
                    Log in
                  </Button>
                  <Button
                    className="rounded-full"
                    render={<Link href="/signup" onClick={() => setOpen(false)} />}
                    nativeButton={false}
                  >
                    Get started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </motion.div>
  );
}
